import React, { createContext, useContext, useEffect, useState } from "react";
import { analyzeFile } from "../analysis";

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
        if (!account || !files[0]?.[0]) return;
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
