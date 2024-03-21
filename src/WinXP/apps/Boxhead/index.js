import styled from 'styled-components';

const BoxheadWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  iframe {
    width: 660px;
    scale: 1.2;
    margin-top: 50px;
    padding-left: 2px;
  }
`;

function Boxhead({ onClose, onMinimize }) {
  return (
    <BoxheadWrap>
      <iframe
        title="Boxhead 2play"
        frameBorder="0" // Note the camelCase here
        width="820px"
        height="600px"
        src="/box-head-game/index.html"
      ></iframe>
    </BoxheadWrap>
  );
}

export default Boxhead;
