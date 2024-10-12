import React, { useEffect, useRef, useState } from 'react';
import { WinChatWrap } from './WinChatStyles';
import DOMPurify from 'dompurify';

function WinChat({ onClose, onMinimize }) {
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref to track the last message
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(['TheFenix', 'RetroGamer', 'NeoDude']);
  const [inputValue, setInputValue] = useState(''); // Input state

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.addEventListener('paste', handlePaste);
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Simulate users joining, leaving, and starting a discussion
    const chatEvents = [
      { type: 'join', user: 'PixelQueen', time: currentTime },
      { type: 'join', user: 'ArcadeMaster', time: currentTime },
      { type: 'message', user: 'TheFenix', text: 'Hello world!', time: currentTime },
      { type: 'message', user: 'RetroGamer', text: 'Hey there!', time: currentTime },
      { type: 'message', user: 'PixelQueen', text: 'What’s the topic today?', time: currentTime },
      { type: 'message', user: 'ArcadeMaster', text: 'Anyone into old-school arcades?', time: currentTime },
      { type: 'quit', user: 'NeoDude', time: currentTime },
    ];

    chatEvents.forEach((event, index) => {
      setTimeout(() => {
        handleChatEvent(event);
      }, index * 1000); // Simulate a 1-second delay between events
    });

    // Cleanup paste event listener on component unmount
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages update
  }, [messages]);

  const handlePaste = (event) => {
    // Prevent the default paste behavior (which includes HTML formatting)
    event.preventDefault();

    // Get the plain text from the clipboard
    const plainText = (event.clipboardData || window.clipboardData).getData('text');

    // Insert the plain text at the current cursor position
    document.execCommand('insertHTML', false, plainText);
  };

  const handleChatEvent = (event) => {
    if (event.type === 'join') {
      setMessages((prevMessages) => [
        ...prevMessages,
        `[${event.time}] *** ${event.user} has joined #Rᴇᴛʀᴏ Sᴛᴀᴛɪᴏɴ`,
      ]);
      setUsers((prevUsers) => [...prevUsers, event.user]);
    } else if (event.type === 'quit') {
      setMessages((prevMessages) => [
        ...prevMessages,
        `[${event.time}] *** Quits: ${event.user} (Leaving)`,
      ]);
      setUsers((prevUsers) => prevUsers.filter((user) => user !== event.user));
    } else if (event.type === 'message') {
      setMessages((prevMessages) => [
        ...prevMessages,
        `[${event.time}] <${event.user}> ${event.text}`,
      ]);
    }
  };

  const handleKeyPress = (event) => {
    let formattedInputValue = DOMPurify.sanitize(inputValue.trim());
    if (event.key === 'Enter' && !event.shiftKey && formattedInputValue) {
      event.preventDefault(); // Prevent Enter from adding new line
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = `[${currentTime}] <TheFenix> ${inputValue}`;
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the message
      setInputValue(''); // Clear input field
      inputRef.current.innerText = ''; // Clear contenteditable div
    }
  };

  const handleInputChange = () => {
    const value = inputRef.current.textContent.replace(/<div>/g, '\n').replace(/<\/div>/g, '');
    setInputValue(value); // Store the value with new lines (\n) for DB
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <WinChatWrap>
      <div className='fixedsys-font'>
        <div>
          <div className='messages-wrap custom-scrollbar'>
            <div className='green-text'>
              [10:00] * Now talking in #Rᴇᴛʀᴏ Sᴛᴀᴛɪᴏɴ
            </div>
            <div className='green-text'>
              [10:00] * Topic is 'Classic Arcade Games and Their Influence on Modern Gaming'
            </div>
            {messages.map((message, index) => (
              <div key={index} className={message.includes('Quits') ? 'dark-purple' : message.includes('*') ? 'green-text' : message.includes('Fenix') ? "purple-text" : ""}>
                {DOMPurify.sanitize(message)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className='users-wrap custom-scrollbar'>
            {users.map((user, index) => (
              <div key={index} className="green-text">@{user}</div>
            ))}
          </div>
        </div>
        <div className='input-line'>
          <div
            ref={inputRef}
            className={`input-div ${inputValue === '' ? 'empty' : ''}`}
            contentEditable="true"
            data-placeholder="Type your message..."
            onKeyPress={handleKeyPress}
            onInput={handleInputChange}
            spellCheck="false"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
        </div>
      </div>
    </WinChatWrap>
  );
}

export default WinChat;
