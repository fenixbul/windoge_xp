import styled from 'styled-components'

export const WinChatWrap = styled.div`
  font-size: 17px;
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
  .purple-text {
    color: purple
  }
  .input-line {
    border-top: 1px solid #ece9da;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 3px 0;
    background: #fefefe;
    z-index: 10;
  }

  .input-line .input-div {
    border: none;
    outline: none;
    padding-left: 2px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .input-line .input-div.empty::before {
    content: attr(data-placeholder);
    color: #ccc;
  }

  .messages-wrap, .messages-wrap div {
    user-select: text;
  }

  .messages-wrap {
    overflow-y: scroll;
    position: absolute;
    left: 0;
    bottom: 3px;
    width: calc(100% - 125px);
    height: auto;
    max-height: calc(100% - 27px);
    padding-bottom: 23px;
    z-index: 6;
    padding-right: 14px;
    white-space: pre-wrap; /* This ensures new lines are respected */
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
`;