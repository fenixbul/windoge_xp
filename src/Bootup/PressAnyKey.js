import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
`;

const BootupScreen = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background: #000;
  color: white;
  font: bolder 16px 'Trebuchet MS', Verdana, sans-serif;
  text-align: left;
  padding: 16px;
  animation: ${fadeIn} 1s ease-out forwards;

  h1 {
    font-size: 16px;
  }
  p {
    font-size: 16px;
    opacity: ${({ blinking }) => (blinking ? 1 : 0)};
  }
`;

const PressAnyKey = ({ onNext }) => {
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const hasBooted = localStorage.getItem('booted');
    const handleKeyPress = () => {
      clearInterval(blinkingTimer);
      setBlinking(true);
      setTimeout(function() {
        // If has booted already, skip step 2 of boot process...
        console.log(hasBooted);
        onNext(hasBooted === 'true' ? 3 : 2);
      }, 800);
    };
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleKeyPress);
    window.addEventListener('touchstart', handleKeyPress);

    // Set up the blinking effect
    const blinkingTimer = setInterval(() => {
      setBlinking(prevBlinking => !prevBlinking);
    }, 250);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleKeyPress);
      window.removeEventListener('touchstart', handleKeyPress);
      clearInterval(blinkingTimer); // Clear the blinking interval on cleanup
    };
  }, [onNext]);

  return (
    <BootupScreen blinking={blinking}>
      <h1>Press any key to boot from CD or DVD...</h1>
      <p>_</p>
    </BootupScreen>
  );
};

export default PressAnyKey;
