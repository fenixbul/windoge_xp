import React, { useState } from 'react';
import MyComputer from './MyComputer';
import Folder from './Folder';
import Breadcrumb from './Breadcrumb';

const Explorer = () => {
  // Simulated file system data
  const fileSystem = {
    "MyComputer": {
      "C:": {
        "Documents and Settings": {
          "User": {
            "My Documents": {
              "My Music": {},
              "My Pictures": {},
              "My Videos": {},
            }
          }
        },
        "Games": {},
        "Program Files": {}
      }
    }
  };

  const [currentPath, setCurrentPath] = useState(["MyComputer"]);

  // Helper function to get current directory based on path
  const getCurrentDir = () => {
    return currentPath.reduce((acc, folder) => acc[folder], fileSystem);
  };

  // Navigation functions
  const navigateTo = (folder) => {
    setCurrentPath([...currentPath, folder]);
  };

  const goBackTo = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumb currentPath={currentPath} goBackTo={goBackTo} />

      {/* Dynamic component rendering */}
      {currentPath.length === 1 && currentPath[0] === 'MyComputer' ? (
        <MyComputer navigateTo={navigateTo} />
      ) : (
        <Folder currentDir={getCurrentDir()} navigateTo={navigateTo} />
      )}
    </div>
  );
};

export default Explorer;
