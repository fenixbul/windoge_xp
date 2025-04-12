import styled from 'styled-components'

export const WinChatWrap = styled.div`
  font-size: 16px;
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

  font-family: 'Fixedsys Excelsior 3.01';
  font-weight: normal;

  .winchat-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .winchat-content.blur {
    filter: blur(3px);
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
    cursor: text;
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
    bottom: 24px;
    width: calc(100% - 125px);
    height: 100%;
    max-height: calc(100% - 24px);
    padding: 2px 14px 3px 3px;
    z-index: 6;
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

  .header__button {
    margin-right: 1px;
    position: relative;
    width: 22px;
    height: 22px;
    border: 1px solid #fff;
    border-radius: 3px;
    &:hover {
      filter: brightness(120%);
    }
    &:hover:active {
      filter: brightness(90%);
    }
  }
  .header__button--close {
    position: absolute;
    right: 3px;
    top: 3px;
    box-shadow: inset 0 -1px 2px 1px #da4600;
    background-image: radial-gradient(
      circle at 90% 90%,
      #cc4600 0%,
      #dc6527 55%,
      #cd7546 70%,
      #ffccb2 90%,
      white 100%
    );
    &:before {
      content: '';
      position: absolute;
      left: 9px;
      top: 2px;
      transform: rotate(45deg);
      height: 16px;
      width: 2px;
      background-color: white;
    }
    &:after {
      content: '';
      position: absolute;
      left: 9px;
      top: 2px;
      transform: rotate(-45deg);
      height: 16px;
      width: 2px;
      background-color: white;
    }
  }

  .modal {
    font-size: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 30px); /* Full width minus 15px margin on each side */
    max-width: 330px; /* Ensures the width doesn't exceed 200px */
    height: auto;
    filter: blur(0);
    z-index: 15;
    background-color: #0055eb;
    padding: 6px 3px 3px 3px;
    color: #fff;
    border-radius: 4px;
    box-sizing: border-box; /* Ensures padding doesn't increase overall size */
  }

  .login-modal {
      .modal-content > p {
        display: inline-block; 
        padding-right: 20px;
        padding-left: 5px;
      }

      .ii-login {
        display: flex;
        align-items: center;
        padding: 8px 10px 7px 10px;
        background: #fff;
        color: #303030;
        cursor: pointer;
        margin-top: 8px;
        > img {
          width: 65px;
          margin-right: 10px;
        }
      }
  }
  .dropdown-menu {
    background: linear-gradient(to right,#edede5 0%,#ede8cd 100%);
    border-bottom: 1px solid lightgray;
    font-family: Tahoma, 'Noto Sans', sans-serif;
    display: flex;
    .drop-down {
      z-index: 15;
    }
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }
  
  /* Handle */
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888; 
  }

  /* Handle on hover */
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
  .
`;