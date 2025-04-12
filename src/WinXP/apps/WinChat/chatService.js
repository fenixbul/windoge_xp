/* eslint-disable no-undef */

export const fetchWelcomeMessages = async () => {
  const now = BigInt(new Date().getTime()) * 1000000n;
  return [
    {
      content: '* Now talking in #Rᴇᴛʀᴏ Sᴛᴀᴛɪᴏɴ',
      timestamp: now,
    },
    {
      content: '* Topic is "Where nostalgia meets the future!"',
      timestamp: now,
    },
  ];
};

export const fetchNewMessages = async (anonymousChatActor, channelId = 1, lastMessageIndex, limit = BigInt(50)) => {
  try {
    const start = lastMessageIndex >= limit ? lastMessageIndex + BigInt(1) : BigInt(0);

    const messagesResult = await anonymousChatActor.getMessages(channelId, start, limit);
    if (messagesResult.err) {
      console.error(
        `Error fetching new messages for channel ${channelId}: ${messagesResult.err}, lastMessageIndex: ${lastMessageIndex}`
      );
      throw new Error(messagesResult.err);
    }

    const messages = messagesResult.ok || [];
    const newestMessageIndex = messages.length > 0 ? messages[messages.length - 1].id : lastMessageIndex;

    return { messages, newestMessageIndex };
  } catch (error) {
    console.error(
      `Error fetching new messages for channel ${channelId} with lastMessageIndex ${lastMessageIndex}:`,
      error.message
    );
    return { messages: [], newestMessageIndex: lastMessageIndex };
  }
};

export const fetchOldMessages = async (anonymousChatActor, channelId = 1, oldestMessageIndex, limit = BigInt(50)) => {
  try {
    const start = oldestMessageIndex >= limit ? oldestMessageIndex - limit : BigInt(0);

    console.log(oldestMessageIndex, start, "OLD");
    const messagesResult = await anonymousChatActor.getMessages(channelId, start, limit);
    if (messagesResult.err) {
      console.error(
        `Error fetching old messages for channel ${channelId}: ${messagesResult.err}, oldestMessageIndex: ${oldestMessageIndex}`
      );
      throw new Error(messagesResult.err);
    }

    const messages = messagesResult.ok || [];
    const oldestMessageIndexFetched = messages.length > 0 ? messages[0].id : oldestMessageIndex;

    return { messages, oldestMessageIndexFetched };
  } catch (error) {
    console.error(
      `Error fetching old messages for channel ${channelId} with oldestMessageIndex ${oldestMessageIndex}:`,
      error.message
    );
    return { messages: [], oldestMessageIndexFetched: oldestMessageIndex };
  }
};

export const refreshUserActivity = async (chatActor, currentUser, isAuthenticated) => {
  if (isAuthenticated && currentUser && chatActor) {
    try {
      await chatActor.updateUserActivity();
    } catch (error) {
      console.error('Error updating user activity:', error.message);
    }
  }
};

export const sendMessage = async (chatActor, message, setMessages) => {
  const tempId = `temp-${Date.now()}`; // Unique temporary ID for the pending message
  const pendingMessage = {
    id: tempId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp,
    status: 'pending',
  };

  setMessages((prev) => [...prev, pendingMessage]);

  try {
    const response = await chatActor.sendMessage(message.content);
    if (response.err) throw new Error(response.err);

    const serverMessageId = response.ok;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === tempId
          ? { ...msg, id: serverMessageId, status: 'sent' }
          : msg
      )
    );
  } catch (error) {
    console.error('Error sending message:', error.message);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      )
    );
  }
};

export const fetchCurrentUser = async (chatActor) => {
  try {
    const userResult = await chatActor.getCurrentUser();
    if (userResult.err) throw new Error(userResult.err);

    return userResult.ok ? userResult.ok[0] : null;
  } catch (error) {
    console.error('Error fetching current user:', error.message);
    return null;
  }
};

export const fetchUsersByIds = async (chatActor, userIds) => {
  try {
    // Call the getUsersByIds function on the actor
    const usersResult = await chatActor.getUsersByIds(userIds);

    if (usersResult.err) {
      throw new Error(usersResult.err);
    }

    // Return the list of users if successful
    return usersResult.ok || [];
  } catch (error) {
    console.error('Error fetching users by IDs:', error.message);
    return [];
  }
};


export const getActiveUsers = async (anonymousChatActor, currentUser) => {
  try {
    const activeUsersResult = await anonymousChatActor.getActiveUsers(currentUser ? [currentUser] : []);
    if (activeUsersResult.err) throw new Error(activeUsersResult.err);

    return activeUsersResult.ok || [];
  } catch (error) {
    console.error('Error fetching active users:', error.message);
    return [];
  }
};
