import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const WinChatWrap = styled.div`
  font-size: 16px;
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: #fefefe;
  @font-face {
    font-family: 'Fixedsys Excelsior 3.01';
    font-style: normal;
    font-weight: normal;
    src: local('Fixedsys Excelsior 3.01'), url('FSEX300.woff') format('woff');
  }
  .fixedsys-font {
    font-family: 'Fixedsys Excelsior 3.01';
    font-weight: normal;
  }

  .green-text {
    color: #3d7f36;
  }
  .dark-purple {
    color: #110c50;
  }
  .input-line {
    border-top: 1px solid #ece9da;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 23px;
  }

  .input-line input {
    border: none;
    outline: none;
    line-height: 23px;
    height: 23px;
    width: calc(100% - 100px);
    padding-left: 2px;
  }

  .messages-wrap {
    overflow-y: scroll;
    position: absolute;
    left: 0;
    width: calc(100% - 125px);
    height: calc(100% - 23px);
    padding-bottom: 23px;
    z-index: 6;
    padding-right: 14px;
  }

  .users-wrap {
    position: absolute;
    right: 0;
    height: calc(100% - 23px);
    width: 137px;
    overflow-y: scroll;
    padding-left: 3px;
    border-left: 12px solid #f0ede8;
    z-index: 5;
  }
  /* Scrollbar styling for WebKit-based browsers (Chrome, Safari, Edge) */
  .custom-scrollbar {
    overflow: scroll;
    scrollbar-width: thin;
    scrollbar-color: #c8d5f8 transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 12px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: orange;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #c8d5f8;
    border-radius: 20px;
    border: 3px solid transparent;
  }
`;

function WinChat({ onClose, onMinimize }) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(['TheFenix', 'RetroGamer', 'NeoDude']);
  const [inputValue, setInputValue] = useState(''); // Input state

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
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
  }, []);

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
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = `[${currentTime}] <TheFenix> ${inputValue}`;
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the message
      setInputValue(''); // Clear input field
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
              <div key={index} className={message.includes('Quits') ? 'dark-purple' : message.includes('*') ? 'green-text' : ""}>
                {message}
              </div>
            ))}
          </div>
          <div className='users-wrap custom-scrollbar'>
            {users.map((user, index) => (
              <div key={index} className="green-text">@{user}</div>
            ))}
          </div>
        </div>
        <div className='input-line'>
          <input 
            type='text' 
            ref={inputRef} 
            value={inputValue} // Bind input value
            onChange={(e) => setInputValue(e.target.value)} // Update state on change
            onKeyPress={handleKeyPress} // Handle Enter key press
          />
        </div>
      </div>
    </WinChatWrap>
  );
}

export default WinChat;
