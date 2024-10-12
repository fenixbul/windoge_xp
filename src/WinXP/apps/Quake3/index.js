import React from 'react';

// add child div to capture mouse event when not focused

function Quake3({ onClose, isFocus }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <iframe
        src="https://quake.windogexp.net/"
        frameBorder="0"
        title="paint"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgb(192,192,192)',
        }}
      />
      {!isFocus && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      )}
    </div>
  );
}

export default Quake3;
