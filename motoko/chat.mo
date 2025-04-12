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
import { recurringTimer } = "mo:base/Timer";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";

actor Chat {
  type HashMap<K, V> = HashMap.HashMap<K, V>;
  type TrieMap<K, V> = TrieMap.TrieMap<K, V>;

  type Result<Ok, Err> = Result.Result<Ok, Err>;

  type UserId = Nat;
  type Username = Text;
  
  type User = {
    id: UserId;              // Unique user ID (could be incremented automatically)
    pid: Principal;
    username: Username;       // User's chosen name
    status: Status;       // Online/offline or other status
  };

  public type UsersList = HashMap<Principal, User>;
  public type UserIdToPrincipal = HashMap<UserId, Principal>;

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
    activeUsers: TrieMap<UserId, Username>;              // List of activeUsers in the channel
  };

  let PAGINATION_MAX_LENGTH = 100;

  stable var userIdToPrincipalRepository : [(UserId, Principal)] = [];
  stable var usersRepository : [(Principal, User)] = [];
  stable var usernamesRepository : [(Username, Bool)] = [];
  stable var channelRepository : (Nat, Text, [(Nat, Username)]) = (1, "Rᴇᴛʀᴏ Sᴛᴀᴛɪᴏɴ", []);
  stable var messagesRepository : [Message] = [];
  stable var nextMsgId = 0;
  stable var nextUserId = 1;

  let userIdToPrincipal: UserIdToPrincipal = HashMap.fromIter<UserId, Principal>(userIdToPrincipalRepository.vals(), 10, Int.equal, Int.hash);
  let users : UsersList = HashMap.fromIter<Principal, User>(usersRepository.vals(), 10, Principal.equal, Principal.hash);
  let usernames : TrieMap<Username, Bool> = TrieMap.fromEntries<Username, Bool>(usernamesRepository.vals(), Text.equal, Text.hash);
  let channel : Channel = {
    id = channelRepository.0;
    name = channelRepository.1;
    activeUsers = TrieMap.fromEntries<Nat, Username>(channelRepository.2.vals(), Nat.equal, Hash.hash);
  };

  let messages = Buffer.fromArray<Message>(messagesRepository);

  // Function to check if username is free
  public query func isUsernameFree(username: Text) : async Bool {
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

  // Function to retrieve the current user based on the caller's identity
  public shared query ({ caller }) func getCurrentUser(): async Result<?User, Text> {
      let userResult = users.get(caller);
      switch (userResult) {
          case (null) {
              return #ok(null); // Caller is not a user
          };
          case (?user) {
              return #ok(?user); // Caller is a registered user
          };
      };
  };

  // Function to create a new user using msg.caller
  public shared ({ caller }) func createUser(username: Text): async Result<User, Text> {
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
        let now = Time.now();
        let newUser : User = {
          id = nextUserId;
          pid = caller;
          username = username;
          status = {
            isOnline = true;
            lastActive = now;
          }
        };

        // Insert new user into users list
        users.put(caller, newUser);
        userIdToPrincipal.put(nextUserId, caller);

        // Add user to the default channel
        channel.activeUsers.put(newUser.id, username);

        // Increment next user ID
        nextUserId += 1;

        // Add to usernames list
        usernames.put(username, true);

        return #ok(newUser);
      };
      case(?user) {
        return #err("User already exists for this Principal!");
      };
    };
  };

  // Function to retrieve users by an array of user IDs
  public query func getUsersByIds(userIds: [UserId]): async Result<[User], Text> {
      // Use a Buffer to collect users dynamically
      let userList = Buffer.Buffer<User>(0); // Start with a capacity of 0

      for (userId in userIds.vals()) {
          let principalResult = userIdToPrincipal.get(userId);
          switch (principalResult) {
              case (null) {};
              case (?principal) {
                  let userResult = users.get(principal);
                  switch (userResult) {
                      case (null) {};
                      case (?user) {
                        userList.add(user);
                    };
                };
            };
        };
    };

    // Convert Buffer to an immutable array
    let resultArray = Buffer.toArray(userList);

    return #ok(resultArray); // Return the list of found users
};

  // Function to join a channel
  // public shared ({ caller }) func joinChannel(channelId: Nat): async Result<Bool, Text> {
  //   if (channel.id == channelId) {
  //     let userResult = users.get(caller);

  //     switch(userResult) {
  //       case(null) {
  //         return #err("User does not exists");
  //       };
  //       case(?userData) {
  //         let userChannelResult = channel.users.get(userData.id);

  //         switch(userChannelResult) {
  //           case(null) {
  //             channel.users.put(userData.id, true);
  //             return #ok(true);
  //           };
  //           case(?userId) {
  //             return #err("User is already in the channel");
  //           };
  //         };
  //       };
  //     };
  //   } else {
  //     return #err("Channel not found");
  //   }
  // };

    // Function to leave the channel
  public shared ({ caller }) func leaveChannel(): async Result<Bool, Text> {
    // Check if the caller is a registered user
    let userResult = users.get(caller);

    switch (userResult) {
      case (null) {
        return #err("User not found. Please create an account first.");
      };
      case (?user) {
        // Attempt to remove the user from the activeUsers in the channel
        let removalResult = channel.activeUsers.remove(user.id);

        switch (removalResult) {
          case (null) {
            return #err("User is not currently in the channel.");
          };
          case (?username) {
            return #ok(true); // Successfully left the channel
          };
        };
      };
    };
  };


  // Function to get the list of active users in the general channel
  public query func getActiveUsers(currentUser: ?User): async Result<[(UserId, Username)], Text> {
    switch (currentUser) {
      case (null) {};
      case (?user) {
        channel.activeUsers.put(user.id, user.username);
      };
    };

    return #ok(Iter.toArray(channel.activeUsers.entries()));
  };

  // Function to update active timestamp for the user (called from frontend)
  public shared ({ caller }) func updateUserActivity(): async Result<Bool, Text> {
      let userResult = users.get(caller);
      switch (userResult) {
          case (null) {
              return #err("User not found. Please create an account first.");
          };
          case (?user) {
              // Update user's last active timestamp
              channel.activeUsers.put(user.id, user.username); // Keep the user in the active list
              let updatedUser = {
                  id = user.id;
                  pid = user.pid;
                  username = user.username;
                  status = {
                      isOnline = true;
                      lastActive = Time.now();
                  }
              };
              users.put(caller, updatedUser);
              return #ok(true);
          };
      };
  };

  // Function to send a message to a channel
  public shared ({ caller }) func sendMessage(content: Text): async Result<Nat, Text> {
    let channelId = 1;
    
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
          // Create the message
          let newMessage: Message = {
            id = nextMsgId;
            sender = user.id;
            content = content;
            timestamp = Time.now();
          };

          // Add message to repository
          messages.add(newMessage);

          // Increment the message ID for the next message
          nextMsgId += 1;

          return #ok(newMessage.id);
        } else {
          return #err("Channel not found.");
        }
      };
    };
  };

  public query func getLastMessageIndex(channelId: Nat) : async Result<Nat, Text> {
      // Validate the channel ID
      if (channel.id != channelId) {
          return #err("Channel not found");
      };

      let totalMessages = messages.size(); // Total messages in the system

      if (totalMessages == 0) {
          return #err("No messages available in the channel.");
      };

      return #ok(totalMessages - 1);
  };

  public query func getMessages(channelId: Nat, start: Nat, limit: Nat) : async Result<[Message], Text> {
      // Validate the channel ID
      if (channel.id != channelId) {
          return #err("Channel not found");
      };

      let totalMessages = messages.size();  // Total messages in the system

      // Validate range
      if (start >= totalMessages) {
          return #ok([]);  // No messages to return if start is out of bounds
      };

      if (limit > PAGINATION_MAX_LENGTH) {
          return #err("Requested limit exceeds the maximum allowed pagination limit.");
      };

      let length = Nat.min(limit, totalMessages - start);  // Calculate the actual number of messages to fetch

      // Safely get the sub-buffer of IDs
      let data = Buffer.subBuffer<Message>(messages, start, length);

      // Convert the buffer to an array and return
      return #ok(Buffer.toArray(data));
  };

  // Function to remove inactive users from the general channel
  private func removeInactiveUsers(): async () {

      let threshold = 4 * 60_000_000_000; // 4 minutes in nanoseconds

      let currentTime = Time.now();

      //Iterate over active users and remove those who have been inactive too long
      for (key in channel.activeUsers.keys()) {
        let userPrincipalResult = userIdToPrincipal.get(key);

        switch (userPrincipalResult) {
          case (?userPrincipal) {
            let userResult = users.get(userPrincipal);

            switch (userResult) {
              case (?user) {
                let timeSinceLastActive = currentTime - user.status.lastActive;
                if (timeSinceLastActive > threshold) {
                    // Remove user from the active users list
                    let result = channel.activeUsers.remove(key);
                };
              };
              case (null) {

              };
            };
          };
          case (null) {

          };
        };
      };
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

  // Call removeInactiveUsers every 5 minutes
  ignore recurringTimer(#seconds (5 * 60), removeInactiveUsers);

  system func preupgrade() {
    messagesRepository := Buffer.toArray<Message>(messages);
    userIdToPrincipalRepository := Iter.toArray(userIdToPrincipal.entries());
    usersRepository := Iter.toArray(users.entries());
    usernamesRepository := Iter.toArray(usernames.entries());
    channelRepository := (channel.id, channel.name, Iter.toArray(channel.activeUsers.entries()));
  };

  system func postupgrade() {
    userIdToPrincipalRepository := [];
    usersRepository := [];
    usernamesRepository := [];
    messagesRepository := [];
  };
};