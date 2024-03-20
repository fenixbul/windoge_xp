import { DEL_APP } from 'WinXP/constants/actions';
import { useEffect } from 'react';

function ICPTokens({ onClose, onMinimize }) {
  // useEffect(() => {
  //   const url = 'https://icptokens.net/'; // Changed to single quotes
  //   window.open(url, '_blank');
  // }, []);

  return (
    <iframe
      title="ICPCoins"
      frameBorder="0" // Note the camelCase here
      width="100%"
      height="100%"
      src="https://icptokens.net/"
    ></iframe>
  );
}

export default ICPTokens;
