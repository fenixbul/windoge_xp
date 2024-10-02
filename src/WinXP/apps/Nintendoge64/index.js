import React from 'react';

function Nintendoge64({ onClose, onMinimize }) {
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
          src="https://nintendoge64.com/"
          title="Nintendoge64"
          width="100%"
          height="100%"
          style={{ border: 'none', height: '100%' }}
        ></iframe>
      </div>
  );
}

export default Nintendoge64;
