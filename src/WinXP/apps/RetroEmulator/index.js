import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Nostalgist } from 'nostalgist';

export default function RetroEmulator() {
  useEffect(() => {
    let nostalgist;

    // Launch the emulator
    const launchEmulator = async () => {
      nostalgist = await Nostalgist.megadrive('http://localhost:3001/sega/Street Fighter 2.sms');
    };

    launchEmulator();

    // Cleanup on component unmount
    return () => {
      if (nostalgist) {
        nostalgist.exit(); // Exit the emulator
      }
    };
  }, []);

  return (
    <Div>
      <h2>NES Emulator</h2>
      {/* The emulator will render its canvas/graphics here */}
      <div id="emulator-container" />
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  #emulator-container {
    width: 640px;
    height: 480px;
    border: 1px solid black;
  }
`;
