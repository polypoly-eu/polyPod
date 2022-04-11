import React, { createContext, useEffect, useState } from "react";
import { MockerPod } from "./pod-mock";

export const MockParentContext = createContext();

export const MockParentContextProvider = ({ children }) => {
  const [pod, setPod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  async function runWithLoadingScreen(task) {
    setIsLoading(true);
    await task();
    setIsLoading(false);
  }

  //on startup
  useEffect(() => {
    const newPod = new MockerPod();
    setPod(newPod);
  }, []);
  return (
    <MockParentContext.Provider
      value={{
        pod,
        isLoading,
        globalError,
        setGlobalError,
        runWithLoadingScreen,
      }}
    >
      {children}
    </MockParentContext.Provider>
  );
};
