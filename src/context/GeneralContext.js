/* eslint-disable no-undef */
import React, { createContext, useContext } from "react";

// Create the GeneralContext
const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  // Helper function to create an actor
  const createActorInstance = (canisterId, identityObj, createActorFunc) => {
    return createActorFunc(canisterId, {
      agentOptions: {
        identity: identityObj,
        host: process.env.DFX_NETWORK === 'ic' ?
          ('https://' + canisterId + '.ic0.app') :
          ('http://127.0.0.1:8080/?canisterId=' + canisterId)
      },
    });
  };

  // Provide the authentication context to the application
  const contextValue = {
    createActorInstance
  };

  return (
    <GeneralContext.Provider value={contextValue}>
      {children}
    </GeneralContext.Provider>
  );
};

// Custom hook to use the General context
export const useGeneralContext = () => {
  return useContext(GeneralContext);
};
