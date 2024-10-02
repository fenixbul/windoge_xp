import React from 'react';

function Bitomni({ onClose, onMinimize }) {
  return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <iframe
          frameBorder="0" // Note the camelCase here
          src="https://dapp.bitomni.io/"
          title="Bitomni"
          width="100%"
          height="100%"
          style={{ border: 'none', height: '100%' }}
        ></iframe>
      </div>
  );
}

export default Bitomni;
