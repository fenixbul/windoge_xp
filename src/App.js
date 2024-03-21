import React, { useState, useEffect } from 'react';
import WinXP from './WinXP'; // Adjust the path if needed
import Bootup from './Bootup';

const App = () => {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('booted');
    if (hasBooted === 'true') {
      setIsBooted(true);
    } else {
      setIsBooted(false);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('booted', 'true');
    setIsBooted(true);
  };

  return isBooted ? <WinXP /> : <Bootup onBootComplete={handleBootComplete} />;
};

export default App;
