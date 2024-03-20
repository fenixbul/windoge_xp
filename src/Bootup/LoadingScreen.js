import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled-component definition
const LoadingScreenWrap = styled.div`
  font: bolder 20px 'Courier New', monospace;
  background-color: #0000aa;
  position: absolute;
  height: 100%;
  width: 100%;
  color: #b0b0bf;
  text-align: center;
  .header {
    padding-top: 16px;
    padding-left: 16px;
    padding-bottom: 4px;
    border-bottom: 1px solid #b0b0bf;
    position: absolute;
    top: 0;
    left: 0;
    padding-right: 16px;
    &::after {
      content: '';
      height: 1px;
      width: 100%;
      background-color: #b0b0bf;
      display: block;
      position: absolute;
      left: 0;
      margin-top: 8px;
    }
  }

  p {
    display: inline-block;
  }

  .loading-wrap {
    border: 1px solid #b0b0bf;
    outline: 1px solid;
    outline-offset: 3px;
    display: block;
    margin: 100px auto;
    width: 100%;
    max-width: 800px;
    padding: 8px 10px;
    text-align: left;
    .progress-wrap {
      span {
        margin-top: 10px;
        display: inline-block;
        width: 100%;
        text-align: center;
      }
    }
    .progress-bar {
      border: 2px solid #b0b0bf;
      height: 40px;
      margin: 5px 40px;
      padding: 6px;
    }
  }
  .footer-bar {
    background-color: #b1b1b1;
    text-align: right;
    color: #010101;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    > span {
      display: inline-block;
      padding-left: 4px;
      border-left: 2px solid #010101;
      > span {
        display: inline-block;
        width: 160px;
        text-align: left;
      }
    }
  }

  .loading-body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100vh;
    width: 100%;
    > div {
      width: 100%;
    }
  }
`;

const LoadingScreen = ({ onNext }) => {
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const importantWindowsXPFiles = ['_default.pif', 'access.chm', 'adptif.dll', 'apcompat.inf', 'appmig.inf', 'asr_ldm.exe', 'atmuni.sys', 'autodisc.dll', 'avifile.dll', 'bios4.rom', 'bootok.exe', 'brmfcmf.inf', 'camera.chm', 'cards.dll', 'cdaudio.sys', 'config.nt', 'ddeml.dll', 'desk.cpl', 'dfs.sys', 'dialer.exe', 'diskcopy.dll', 'dplaysvr.exe', 'dsound.dll', 'dvdplay.exe', 'eventvwr.msc', 'explorer.exe', 'fastfat.sys', 'fc.exe', 'filemgmt.msc', 'find.exe', 'fontview.exe', 'freecell.exe', 'fsquirt.exe', 'ftp.exe', 'gdi32.dll', 'hal.dll', 'hh.exe', 'hid.dll', 'hnetcfg.dll', 'hostmib.dll', 'http.sys', 'iexpress.exe', 'imapi.exe', 'imgutil.dll', 'inetmib1.dll', 'ipconfig.exe', 'ipnat.sys', 'ipsec.sys', 'ipv6.exe', 'kernel32.dll', 'logoff.exe', 'login.scr', 'magnify.exe', 'main.cpl', 'mdm.exe', 'mfc42.dll', 'mmc.exe', 'mobsync.exe', 'mouclass.sys', 'mplay32.exe', 'msconfig.exe', 'msdtc.exe', 'mshearts.exe', 'mshtml.dll', 'msiexec.exe', 'msinfo32.exe', 'mspaint.exe', 'mstsc.exe', 'nbtstat.exe', 'nddeapir.exe', 'net.exe', 'net1.exe', 'netbt.sys', 'netcfgx.dll', 'netdiag.exe', 'netshell.dll', 'netstat.exe', 'ntbackup.exe', 'ntdll.dll', 'ntkrnlpa.exe', 'ntldr', 'ntoskrnl.exe', 'ntvdm.exe', 'nwlink.sys', 'ole32.dll', 'oleaut32.dll', 'osk.exe', 'packager.exe', 'perfmon.exe', 'ping.exe', 'powercfg.cpl', 'print.exe', 'progman.exe', 'rasautou.exe', 'rasdlg.dll', 'regedit.exe', 'regsvr32.exe', 'rstrui.exe', 'rtutils.dll', 'sc.exe', 'scardsvr.exe', 'schannel.dll', 'secedit.exe', 'services.exe', 'sethc.exe', 'setupapi.dll', 'sfc.exe', 'shell32.dll', 'smss.exe', 'sndrec32.exe', 'sol.exe', 'spoolsv.exe', 'svchost.exe', 'syncapp.exe', 'sysedit.exe', 'syskey.exe', 'system.ini', 'taskmgr.exe', 'tcpsvcs.exe', 'telnet.exe', 'user32.dll', 'userinit.exe', 'utilman.exe', 'verifier.exe', 'w32time.dll', 'win32k.sys', 'winver.exe', 'wmi.exe', 'wmiprvse.exe', 'write.exe', 'wscui.cpl', 'wuaucpl.cpl', 'wuaueng.dll', 'xpsp1res.dll'];

  useEffect(() => {
    const loadFiles = async () => {
      for (let file of importantWindowsXPFiles) {
        await new Promise(resolve => {
          const delay = Math.random() * 500; // Random delay between 0 to 1000 milliseconds
          setTimeout(() => {
            setFileName(file);
            resolve();
          }, delay);
        });
      }
    };

    loadFiles();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    let isActive = true; // Flag to check if the component is still mounted
    let velocity = 1; // Starting velocity
    let delayVelocity = 10;

    const updateProgress = () => {
      if (!isActive) return; // Prevent update if component has unmounted

      setProgress(currentProgress => {
        if (currentProgress >= 100) {
          return currentProgress;
        }

        velocity = Math.min(velocity + 0.1, 5);

        const minStep = Math.max(1, Math.ceil(velocity));
        const maxStep = Math.ceil(velocity * 3);

        let progressStep = Math.max(
          minStep,
          Math.floor(Math.random() * maxStep) + 1,
        );

        if (currentProgress > 70) {
          progressStep = 9;
        }

        if (currentProgress >= 91) {
          progressStep = 1;
        }

        const newProgress = Math.min(currentProgress + progressStep, 100);

        if (newProgress < 100) {
          const delayBase = 1500 - velocity * 200;
          let delay = Math.floor(Math.random() * (delayBase - 500 + 1)) + 500;

          delayVelocity += 80;
          delay -= delayVelocity;

          if (currentProgress >= 80) {
            delay = 800;
          }

          setTimeout(updateProgress, Math.max(delay, 250));
        } else {
          setTimeout(() => {
            onNext(3); // Call your onNext or similar function here
          }, 2200);
        }

        return newProgress;
      });
    };

    const timeoutId = setTimeout(updateProgress, 1000);

    // Cleanup function to set isActive false when the component unmounts
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <LoadingScreenWrap>
      <div className="header">Windoge XP Professional Setup</div>
      <div className="loading-body">
        <div>
          <p>
            <div>Please wait while Setup copies files.</div>
            <div>This might take several seconds to complete.</div>
          </p>
          <div className="loading-wrap">
            Setup is copying files...
            <div className="progress-wrap">
              <span className="progress-value">{progress}%</span>
              <div className="progress-bar">
                <div
                  style={{
                    width: `${progress}%`,
                    backgroundColor: '#ffff54', // Highlight color for progress
                    display: 'block',
                    height: '100%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='footer-bar'>
        <span>Copying: <span>{fileName}</span></span>
      </div>
    </LoadingScreenWrap>
  );
};

export default LoadingScreen;
