import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BootupScreen = styled.div`
  display: block;
  background: black;
  width: 100%;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  .loading-container {
    display: block;
    height: 46px;
    max-width: 380px;
    border: 3px solid #a8a8a8;
    border-radius: 12px;
    scale: 0.5;
    overflow: hidden;
    position: relative;
  }
  .logo {
    width: 100%;
    max-width: 400px;
    margin-bottom: 50px;
  }
  .loading-wrap {
    width: 100px;
    position: absolute;
    left: 0; /* Initially start from the left edge */
    top: 3px;
    > span {
      background-repeat: repeat-x;
      display: inline-block;
      width: 22px;
      height: 33px;
      border-radius: 3px;
      margin-right: 6px;
    }
    .rect1 {
      background-image: url("/bootup/gradient1.png");
    }
    .rect2 {
      background-image: url("/bootup/gradient2.png");
    }
    .rect3 {
      background-image: url("/bootup/gradient3.png");
    }
  }

  .animation-wrap {
    padding: 10px 40px;
    text-align: center;

    animation: ${fadeIn} 2.8s ease-out forwards;
  }
  span.footer {
    position: absolute;
    left: 20px;
    bottom: 22px;
    color: #f1f1f1;
    font-size: 16px;
  }
`;

const BootupAnimation = ({ onBootComplete }) => {
  const loadingWrapRef = useRef(null);

  useEffect(() => {
    const loadingWrap = loadingWrapRef.current;
    let position = -150; // Initial position
    const interval = setInterval(() => {
      position += 20; // Move 10 pixels per step
      loadingWrap.style.left = `${position}px`;
      if (position >= 400) {
        position = -150; // Reset position when it reaches the end
      }
    }, 70); // Adjust interval duration as needed

    const timer = setTimeout(() => {
    clearInterval(interval);
      if (onBootComplete) {
        localStorage.setItem('booted', 'true');
        onBootComplete();
      }
    }, 8 * 1000); // Adjust time for bootup animation as needed

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onBootComplete]);

  return (
    <BootupScreen>
      <div className='animation-wrap'>
        <img src="/bootup/logo.png" className='logo' />
        <div className='loading-container'>
          <div ref={loadingWrapRef} className='loading-wrap'>
            <span className='rect1'></span>
            <span className='rect2'></span>
            <span className='rect3'></span>
          </div>
        </div>
        <span className='footer'>Powered by Internet Computer ® 100% on-chain</span>
      </div>
    </BootupScreen>
  );
};

export default BootupAnimation;
