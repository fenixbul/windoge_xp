import React, { useState, useEffect } from 'react';
import WinXP from './WinXP'; // Adjust the path if needed
import Bootup from './Bootup';
import { AuthProvider } from 'context/AuthContext';
import { GeneralProvider } from 'context/GeneralContext';

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
      <AuthProvider>
        <GeneralProvider>
          {process.env.NODE_ENV === 'development' ? (
            <WinXP />
          ) : (
            isBooted ? <WinXP /> : <Bootup onBootComplete={handleBootComplete} />
          )}
        </GeneralProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
