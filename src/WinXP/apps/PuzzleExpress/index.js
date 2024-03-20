import styled from 'styled-components';

const PuzzleExpressWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  iframe {
    scale: 1.5;
    margin-top: 100px;
  }
`;

function PuzzleExpress({ onClose, onMinimize }) {
  return (
    <PuzzleExpressWrap>
      <iframe
        title="Puzzle Express"
        frameBorder="0" // Note the camelCase here
        width="580x"
        height="450px"
        src="https://www.game-remakes.com/play2.php?id=100"
      ></iframe>
    </PuzzleExpressWrap>
  );
}

export default PuzzleExpress;
