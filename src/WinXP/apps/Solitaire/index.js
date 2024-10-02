import React from 'react';
import styled from 'styled-components';

const SolitaireWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

function Solitaire({ onClose, onMinimize }) {
  const height = "462px";
  const width = "670px";

  return (
    <SolitaireWrap>
      <iframe
        title="Solitaire"
        frameBorder="0" // Note the camelCase here
        width={width}
        height={height}
        src="/solitaire-game/index.html"
      ></iframe>
    </SolitaireWrap>
  );
}

export default Solitaire;
