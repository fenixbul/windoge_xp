import React, { useRef, useState } from 'react';
import DOMPurify from 'dompurify';

function ChatInput({ onSendMessage, onFocusChange }) {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event) => {
    const formattedInputValue = DOMPurify.sanitize(inputValue.trim());
    if (event.key === 'Enter' && !event.shiftKey && formattedInputValue) {
      event.preventDefault();
      onSendMessage(inputValue);
      setInputValue('');
      inputRef.current.innerText = '';
    }
  };

  const handleInputChange = () => {
    const value = inputRef.current.textContent.replace(/<div>/g, '\n').replace(/<\/div>/g, '');
    setInputValue(value);
  };

  const handleFocus = () => {
    onFocusChange(true);
  };

  const handleBlur = () => {
    onFocusChange(false);
  };

  return (
    <div className='input-line'>
      <div
        ref={inputRef}
        className={`input-div ${inputValue === '' ? 'empty' : ''}`}
        contentEditable="true"
        data-placeholder="Type your message..."
        onKeyPress={handleKeyPress}
        onInput={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        spellCheck="false"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />
    </div>
  );
}

export default ChatInput;
