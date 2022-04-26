import React, { createContext, useContext, useEffect, useState } from "react";
import { analyzeFile } from "@polypoly-eu/poly-analysis";

/**
 * Poly Analysis Context - This context is responsible for maintaining the fileAnalysis up to date with the latest analyses based on how dataAccount changes.
 * @param {AnalysisClass[]} [subAnalysis] - Analysis class that extend RootAnalysis. Usually found in the anlysis.js file that is held in a specific feature
 * @param {context} [parentContext] - Reference to context that holds variables that this context and other modules should react to.
 */

export const PolyAnalysisContext = createContext();

export const PolyAnalysisProvider = ({
  children,
  subAnalyses,
  parentContext,
}) => {
  const { account, files } = useContext(parentContext);
  const [fileAnalysis, setFileAnalysis] = useState(null);

  //When the account model is created in the importer Context, the analyses are triggered.
  useEffect(() => {
    if (!account || !files?.[0]) return;
    analyzeFile({
      zipData: files[0],
      dataAccount: account,
      subAnalyses,
    }).then((fileAnalysis) => setFileAnalysis(fileAnalysis));
  }, [account]);

  return (
    <PolyAnalysisContext.Provider
      value={{
        fileAnalysis,
      }}
    >
      {children}
    </PolyAnalysisContext.Provider>
  );
};
