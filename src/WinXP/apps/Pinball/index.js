import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const PinballWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  iframe {
    scale: 1.2;
    margin-top: 50px;
  }
`;

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function Pinball({ onClose, onMinimize, isFocus }) {
  const height = isMobileDevice() ? "580px" : "500px";
  const iframeRef = useRef(null); // Create a ref for the iframe

  useEffect(() => {
    // Focus the iframe when isFocus becomes true
    if (isFocus && iframeRef.current) {
      iframeRef.current.focus(); // Programmatically focus the iframe
    }
  }, [isFocus]); // Trigger when isFocus changes

  return (
    <PinballWrap>
      <iframe
        title="Pinball"
        frameBorder="0"
        width="100%"
        height={height}
        src="/space-cadet-game/index.html"
        ref={iframeRef} // Attach the ref to the iframe
        tabIndex={-1} // Ensure the iframe is focusable
      ></iframe>
    </PinballWrap>
  );
}

export default Pinball;
