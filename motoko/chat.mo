import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import TrieMap "mo:base/TrieMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor Chat {
  type HashMap<K, V> = HashMap.HashMap<K, V>;
  type TrieMap<K, V> = TrieMap.TrieMap<K, V>;

  type Result<Ok, Err> = Result.Result<Ok, Err>;

  type UserId = Nat;
  
  type User = {
    id: UserId;              // Unique user ID (could be incremented automatically)
    pid: Principal;
    username: Text;       // User's chosen name
    status: Status;       // Online/offline or other status
  };

  public type UsersList = HashMap<Principal, User>;

  type Status = {
    isOnline: Bool;
    lastActive: Time.Time;     // Tracks the last time the user was active
  };

  type Message = {
    id: Nat;              // Unique message ID
    sender: UserId;         // The user who sent the message
    content: Text;        // The message text
    timestamp: Time.Time;      // Time the message was sent
  };

  type Channel = {
    id: Nat;                    // Unique channel ID
    name: Text;                 // Channel name (e.g., "#general")
    users: TrieMap<Nat, Bool>;              // List of users in the channel
  };

  let PAGINATION_MAX_LENGTH = 100;

  stable var usersRepository : [(Principal, User)] = [];
  stable var usernamesRepository : [(Text, Bool)] = [];
  stable var channelRepository : (Nat, Text, [(Nat, Bool)]) = (1, "Rᴇᴛʀᴏ Sᴛᴀᴛɪᴏɴ", []);
  stable var messagesRepository : [(Nat, Message)] = [];
  stable var nextMsgId = 1;
  stable var nextUserId = 1;

  let users : UsersList = HashMap.fromIter<Principal, User>(usersRepository.vals(), 10, Principal.equal, Principal.hash);
  let usernames : TrieMap<Text, Bool> = TrieMap.fromEntries<Text, Bool>(usernamesRepository.vals(), Text.equal, Text.hash);
  let channel : Channel = {
    id = channelRepository.0;
    name = channelRepository.1;
    users = TrieMap.fromEntries<Nat, Bool>(channelRepository.2.vals(), Nat.equal, Hash.hash);
  };
  let messages : TrieMap<Nat, Message> = TrieMap.fromEntries<Nat, Message>(
    messagesRepository.vals(), Nat.equal, Hash.hash
  );

  // Function to check if username is free
  public func isUsernameFree(username: Text) : async Bool {
    let result = usernames.get(username);

    switch(result) {
      case(null) {
        return true;
      };
      case(_) {
        return false;
      };
    };
  };

  // Function to create a new user using msg.caller
  public shared ({ caller }) func createUser(username: Text): async Result<Nat, Text> {
    if (not isValidUsername(username)) {
      return #err("Invalid username. Only letters, numbers, underscores, and hyphens are allowed.");
    };

    let isFree = await isUsernameFree(username);
    if (not isFree) {
      return #err("Username is already taken");
    };

    let userResult = users.get(caller);

    switch(userResult) {
      case(null) {
        let newUser : User = {
          id = nextUserId;
          pid = caller;
          username = username;
          status = {
            isOnline = true;
            lastActive = Time.now();
          }
        };

        // Insert new user into users list
        users.put(caller, newUser);

        // Add user to the default channel
        channel.users.put(newUser.id, true);

        // Increment next user ID
        nextUserId += 1;

        // Add to usernames list
        usernames.put(username, true);

        return #ok(newUser.id);
      };
      case(?user) {
        return #err("User already exists for this Principal!");
      };
    };
  };

  // Function to join a channel
  public shared ({ caller }) func joinChannel(channelId: Nat): async Result<Bool, Text> {
    if (channel.id == channelId) {
      let userResult = users.get(caller);

      switch(userResult) {
        case(null) {
          return #err("User does not exists");
        };
        case(?userData) {
          let userChannelResult = channel.users.get(userData.id);

          switch(userChannelResult) {
            case(null) {
              channel.users.put(userData.id, true);
              return #ok(true);
            };
            case(?userId) {
              return #err("User is already in the channel");
            };
          };
        };
      };
    } else {
      return #err("Channel not found");
    }
  };

  // Function to update user's lastActive time
  public shared ({ caller }) func updateUserLastActive(): async Result<Bool, Text> {
    let callerPrincipal = caller;
    switch (users.get(callerPrincipal)) {
      case (?user) {
        let updatedUser = {
          id = user.id;
          pid = user.pid;
          username = user.username;
          status = {
            isOnline = user.status.isOnline;
            lastActive = Time.now();
          }
        };
        users.put(callerPrincipal, updatedUser);
        return #ok(true);
      };
      case null {
        return #err("User not found");
      }
    }
  };

  // Function to send a message to a channel
  public shared ({ caller }) func sendMessage(channelId: Nat, content: Text): async Result<Nat, Text> {
    if (content.size() == 0) {
      return #err("Message content cannot be empty.");
    };

    // Check if user exists
    let userResult = users.get(caller);
    switch (userResult) {
      case (null) {
        return #err("User not found. Please create an account first.");
      };
      case (?user) {
        // Check if user is part of the specified channel
        if (channel.id == channelId) {
          let isMember = channel.users.get(user.id);
          switch (isMember) {
            case (null) {
              return #err("User is not part of the specified channel.");
            };
            case (?_) {
              // Create the message
              let newMessage: Message = {
                id = nextMsgId;
                sender = user.id;
                content = content;
                timestamp = Time.now();
              };

              // Add message to repository
              messages.put(nextMsgId, newMessage);

              // Increment the message ID for the next message
              nextMsgId += 1;

              return #ok(newMessage.id);
            };
          };
        } else {
          return #err("Channel not found.");
        }
      };
    };
  };

  // TODO: TO be fixed
  public query func getMessages(channelId: Nat, start: Nat, limit: Nat) : async Result<[Message], Text> {
      // Check if the channel exists
      if (channel.id != channelId) {
        return #err("Channel not found");
      };

      let totalMessages = messages.size();  // Get the total number of messages in the system

      if (start >= totalMessages) {
        return #ok([]);  // No messages to return if start is beyond available messages
      };

      if (limit > PAGINATION_MAX_LENGTH) {
        return #err("Requested limit exceeds the maximum allowed pagination limit.");
      };

      let endIndex = Nat.min(start + limit, totalMessages);

      // Check to avoid invalid ranges
      if (endIndex <= start) {
          return #ok([]);  // Return empty if there's nothing to fetch
      };

      // Retrieve all messages (you can optimize this based on channel)
      let allMessages = Iter.toArray<Nat>(messages.keys());
      let pageIds = Array.subArray(allMessages, start, endIndex - start);  // Get a slice of IDs
      
      // Get message IDs for this channel only
      let channelMessages = Array.map<Nat, Message>(pageIds, func(id: Nat) : Message {
          let msg = messages.get(id);
          switch(msg) {
              case (?message) { return message };
              case null { Debug.trap("Message not found, this should not happen"); };
          };
      });

      return #ok(channelMessages);
  };
  
  private func isValidUsername(username: Text): Bool {
    if (username.size() == 0) {
      return false;  // Username cannot be empty
    };
    
    for (i in Text.toIter(username)) {
      if (not (isAlpha(i) or isDigit(i) or i == '_' or i == '-')) {
        return false;  // Invalid character found
      }
    };
    return true;  // All characters are valid
  };

  private func isAlpha(c: Char): Bool {
    return (c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z');
  };

  private func isDigit(c: Char): Bool {
    return c >= '0' and c <= '9';
  };

  system func preupgrade() {
    messagesRepository := Iter.toArray(messages.entries());
    usersRepository := Iter.toArray(users.entries());
    usernamesRepository := Iter.toArray(usernames.entries());
    channelRepository := (channel.id, channel.name, Iter.toArray(channel.users.entries()));
  };

  system func postupgrade() {
    usersRepository := [];
    usernamesRepository := [];
    messagesRepository := [];
  };
};