/* eslint-disable no-undef */
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { AccountIdentifier } from "@dfinity/ledger-icp";

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [identity, setIdentity] = useState(null);
  const sessionDurationInDays = 30;

  // Initialize the authentication client and check authentication state
  const initAuth = async () => {
    const client = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });
    
    setAuthClient(client);

    const isAuthenticatedResponse = await client.isAuthenticated();
    
    if (isAuthenticatedResponse) {
      await initializeUserSession(client);
    } else {
      setIsAuthenticated(isAuthenticatedResponse);
    }
  };

  useEffect(() => {
    initAuth(); // On component mount, initialize the authentication client
  }, []);

  useEffect(() => {
    setIsAuthenticated(identity ? true : false);
  }, [identity])

  // Initialize the user session and create actors
  const initializeUserSession = async (client) => {
    const identityObj = client.getIdentity();
    setIdentity(identityObj);

    // const userAccountIdentifier = AccountIdentifier.fromPrincipal({
    //   principal: null //TODO: fetch userPrincipal
    // });

    setUser({
      principal: null, // userPrincipal
      account: null // userAccountIdentifier
    });
  };

  // Login function
  const login = async () => {
    authClient.login({
      maxTimeToLive: BigInt(sessionDurationInDays * 24 * 60 * 60 * 1000 * 1000 * 1000),
      disableIdle: true,
      identityProvider: process.env.DFX_NETWORK === 'ic' ?
        'https://identity.ic0.app/#authorize' : 
        `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8080/#authorize`,
      onSuccess: async () => {
        setIsAuthenticated(await authClient.isAuthenticated());
        await initializeUserSession(authClient);
      }
    });
  };

  // Logout function
  const logout = async () => {
    if (!authClient) return; // Ensure the auth client is initialized
    await authClient.logout();
    // This fix a "sign in -> sign out -> sign in again" flow without window reload.
    await initAuth();
    setIsAuthenticated(false);
    setIdentity(null);
    setUser(null);
  };

  // Provide the authentication context to the application
  const contextValue = {
    isAuthenticated,
    identity,
    user,
    authClient,
    initializeUserSession,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
