import React from 'react';

function TrumpForce({ onClose, onMinimize }) {
  return (
    <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
      <iframe
        title="Trump Force"
        frameBorder="0" // Note the camelCase here
        width="100%"
        height="100%"
        src="/trump-force/index.html"
      ></iframe>
    </div>
  );
}

export default TrumpForce;
