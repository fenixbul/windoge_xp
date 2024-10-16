import React, { useEffect, useRef } from 'react';
import Webamp from 'webamp';
import { initialTracks } from './config';

function Winamp({ onClose, onMinimize }) {
  const ref = useRef(null);
  const webamp = useRef(null);
  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }
    webamp.current = new Webamp({
      initialTracks,
      __initialWindowLayout: {
          main: { position: { x: 0, y: 0 } },
          equalizer: { position: { x: 0, y: 116 } },
          playlist: { position: { x: 0, y: 232 }, size: [0, 2] },
      }
    });
    webamp.current.renderWhenReady(target).then(() => {
      target.appendChild(document.querySelector('#webamp'));

      let initialWinampXPosition = 0;
      let initialWinampYPosition = 0;

      if(window.innerWidth < 800) {
        initialWinampXPosition = (document.body.clientWidth) - 295;
        initialWinampYPosition = (document.body.clientHeight) - 485;
      } else {
        initialWinampXPosition = (document.body.clientWidth / 2) - 137;
      }
      
      webamp.current.store.dispatch({
        type: 'UPDATE_WINDOW_POSITIONS',
        positions: {
          main: { x: initialWinampXPosition, y: 30 + initialWinampYPosition },
          equalizer: { x: initialWinampXPosition, y: 146 + initialWinampYPosition },
          playlist: { x: initialWinampXPosition, y: 262 + initialWinampYPosition }
        }
      });
    });

    return () => {
      webamp.current.dispose();
      webamp.current = null;
    };
  }, []);
  useEffect(() => {
    if (webamp.current) {
      webamp.current.onClose(onClose);
      webamp.current.onMinimize(onMinimize);
    }
  });
  return (
    <div
      style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0 }}
      ref={ref}
    />
  );
}

export default Winamp;
