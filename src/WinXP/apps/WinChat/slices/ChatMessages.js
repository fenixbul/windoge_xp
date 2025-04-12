/* eslint-disable no-undef */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import DOMPurify from 'dompurify';

import {
  fetchWelcomeMessages,
  fetchNewMessages,
  fetchOldMessages
} from '../chatService';
import { useAuth } from 'context/AuthContext';

const ChatMessages = forwardRef(({chatActor, anonymousChatActor, currentUserRef}, ref) => {
  const { isAuthenticated } = useAuth();

  const messagesEndRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);

  const lastMessageIndexRef = useRef(BigInt(0));
  const oldestMessageIndexRef = useRef(BigInt(0));

  useEffect(() => {
    const initializeChat = async () => {
      const lastMessageIndexResult = await anonymousChatActor.getLastMessageIndex(1);
      if (lastMessageIndexResult.err) throw new Error(lastMessageIndexResult.err);
      lastMessageIndexRef.current = lastMessageIndexResult.ok;

      await fetchAndMergeNewMessages(20);
      const welcomeMessages = await fetchWelcomeMessages();
      setMessages((prev) => [...prev, ...welcomeMessages]);
    };
    
    initializeChat();

    const messagesInterval = setInterval(() => {
      fetchAndMergeNewMessages();
    }, 1000);

    return () => {
      clearInterval(messagesInterval);

      if (isAuthenticated && chatActor) {
        chatActor.leaveChannel().catch((err) => console.error('Error leaving channel:', err));
      }
    };
  }, []);

  // Expose the `scrollToBottom` function to the parent component via the forwarded ref.
  // This allows the parent to programmatically trigger scrolling to the bottom of the messages box.
  useImperativeHandle(ref, () => ({
    scrollToBottom,
    setMessages
  }));

  // Automatically scroll to the bottom of the messages box whenever new messages are added,
  // but only if the user is already scrolled to the bottom (to avoid interrupting manual scrolling).
  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    messagesRef.current = messages;

    // If there are messages, check if the last message in the list was sent by the current user.
    // If the last message was sent by the current user and the messages box reference is valid,
    // automatically scroll the messages box to the bottom to ensure the latest message is visible.
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.sender === currentUserRef.current?.id || isScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  // Merge new messages into the current list of messages in the state.
  const mergeMessages = (newMessages) => {
    setMessages((prev) => {
      const existingMessages = [...prev];
      // Append new messages from the server if they are not already in the list
      newMessages.forEach((msg) => {
        if (!existingMessages.some((existingMsg) => existingMsg.id === msg.id)) {
          existingMessages.push(msg);
        }
      });
  
      // Append pending messages at the end
      return [...existingMessages];
    });
  };
  
  // Fetch new messages from the server and merge them with the existing state.
  const fetchAndMergeNewMessages = async (offset = 0) => {
    console.log(lastMessageIndexRef.current);
    if(lastMessageIndexRef.current) {
      const { messages: newMessages, newestMessageIndex } = await fetchNewMessages(
        anonymousChatActor,
        1,
        lastMessageIndexRef.current - BigInt(offset)
      );
  
      if (newMessages.length > 0) {
        mergeMessages(newMessages);
        console.log(newestMessageIndex, "grr");
        lastMessageIndexRef.current = newestMessageIndex;
      }
    }
  };

  const handleScroll = () => {
    if (messagesBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesBoxRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // Allow a small buffer
      setIsScrolledToBottom(atBottom);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      } catch (e) {
        messagesEndRef.current.scrollIntoView();
      }
    }
  };

  function formatNanosecondsTo24HourTime(nanoseconds) {
    const milliseconds = Number(nanoseconds / 1000000n);
    const date = new Date(milliseconds);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  return (
    <div
      className='messages-wrap custom-scrollbar'
      ref={messagesBoxRef}
      onScroll={handleScroll}
    >
      <div className='messages-box'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === 'Quits'
                ? 'dark-purple'
                : !message.sender
                ? 'green-text'
                : message.sender === 0
                ? 'purple-text'
                : ''
            }
          >
            {message.sender && (
              <>[{formatNanosecondsTo24HourTime(message.timestamp)}] &lt;{Number(message.sender)}&gt; </>
            )}
            {DOMPurify.sanitize(message.content)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

export default ChatMessages;
