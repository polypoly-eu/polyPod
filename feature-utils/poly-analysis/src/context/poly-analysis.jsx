import React, { createContext, useContext, useEffect, useState } from "react";

export const PolyAnalysisContext = createContext();

export const PolyAnalysisProvider = ({
    children,
    parentContext,
    subAnalyses,
    analyzeFile,
}) => {
    const { account, files } = useContext(parentContext);
    const [fileAnalysis, setFileAnalysis] = useState(null);

    //When the account model is created in the importer Context, the analyses are triggered.
    useEffect(() => {
        if (!files?.[0]) return;
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
