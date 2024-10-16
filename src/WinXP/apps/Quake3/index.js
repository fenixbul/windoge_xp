import React, { useEffect, useRef } from 'react';

function Quake3({ onClose, isFocus }) {
  const iframeRef = useRef(null);

  // Function to handle focus on the iframe
  const handleFocusIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  useEffect(() => {
    if (isFocus) {
      handleFocusIframe(); // Focus iframe if isFocus becomes true
    }
  }, [isFocus]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <iframe
        src="https://quake.echoplay.win/" // Keep the iframe src constant, no reset needed
        frameBorder="0"
        title="quake3"
        ref={iframeRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgb(192,192,192)',
        }}
        tabIndex={-1} // Ensure iframe can be focused programmatically
      />
      {!isFocus && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            backgroundColor: 'transparent', // Keep it invisible but clickable
            zIndex: 10, // Overlay on top of iframe
          }}
          onClick={handleFocusIframe} // Focus iframe on click
        />
      )}
    </div>
  );
}

export default Quake3;
