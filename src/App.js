import React, { useState, useEffect } from 'react';
import WinXP from './WinXP'; // Adjust the path if needed
import Bootup from './Bootup';

const App = () => {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const hasBooted = isBooted;
    if (hasBooted === true) {
      setIsBooted(true);
    }
  }, [isBooted]);

  const handleBootComplete = () => {
    setIsBooted(true);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'fixed' }}>
      {process.env.NODE_ENV === 'development' ? (
        <WinXP />
      ) : (
        isBooted ? <WinXP /> : <Bootup onBootComplete={handleBootComplete} />
      )}
    </div>
  );
};

export default App;
