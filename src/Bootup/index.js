import { useState } from 'react';
import BootupAnimation from './BootupAnimation';
import LoadingScreen from './LoadingScreen';
import PressAnyKey from './PressAnyKey';

const Bootup = ({ onBootComplete }) => {
  const [stage, setStage] = useState(1);

  const handleNext = value => {
    setStage(value);
  };

  return (
    <>
      {stage === 1 && <PressAnyKey onNext={handleNext} />}
      {stage === 2 && <LoadingScreen onNext={handleNext} />}
      {stage === 3 && <BootupAnimation onBootComplete={onBootComplete} />}
    </>
  );
};

export default Bootup;
