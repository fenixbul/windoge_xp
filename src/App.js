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
  }, []);

  const handleBootComplete = () => {
    setIsBooted(true);
  };

  return isBooted ? <WinXP /> : <Bootup onBootComplete={handleBootComplete} />;
};

export default App;
