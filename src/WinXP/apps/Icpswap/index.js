import { useEffect } from 'react';

function Icpswap({ onClose, onMinimize }) {
  useEffect(() => {
    const url = 'https://app.icpswap.com/swap?input=ryjl3-tyaaa-aaaaa-aaaba-cai&output=wqihv-qyaaa-aaaak-afjoa-cai'; // Changed to single quotes
    window.open(url, '_blank');
  }, []);

  return (<></>);
}

export default Icpswap;
