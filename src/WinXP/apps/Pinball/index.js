import React from 'react';
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

function Pinball({ onClose, onMinimize }) {
  const height = isMobileDevice() ? "580px" : "500px";

  return (
    <PinballWrap>
      <iframe
        title="Pinball"
        frameBorder="0" // Note the camelCase here
        width="100%"
        height={height}
        src="/space-cadet-game/index.html"
      ></iframe>
    </PinballWrap>
  );
}

export default Pinball;
