import styled from 'styled-components';

const PinballWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  iframe {
    scale: 1.3;
    margin-top: 70px;
  }
`;

function Pinball({ onClose, onMinimize }) {
  return (
    <PinballWrap>
      <iframe
        title="Pinball"
        frameBorder="0" // Note the camelCase here
        width="100%"
        height="500px"
        src="/space-cadet-game/index.html"
      ></iframe>
    </PinballWrap>
  );
}

export default Pinball;
