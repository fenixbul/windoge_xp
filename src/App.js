import React, { useState, useEffect } from 'react';
import WinXP from 'WinXP';
import Bootup from './Bootup'; // Assuming Bootup is in the same directory

const App = () => {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const booted = 'false';
    setIsBooted(booted === 'true');
  }, []);

  const handleBootComplete = () => setIsBooted(true);

  return isBooted ? <WinXP /> : <Bootup onBootComplete={handleBootComplete} />;
};

export default App;
