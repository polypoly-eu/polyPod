import React, { createContext, useContext, useEffect, useState } from "react";
import { ImporterContext } from "./importer-context.jsx";
import { analyzeFile } from "../model/analysis.js";

export const FileLoaderContext = createContext();

export const FileLoaderProvider = ({ children }) => {
    const { files, facebookAccount } = useContext(ImporterContext);

    const [fileAnalysis, setFileAnalysis] = useState(null);

    // On account changed
    // When the account changes run the analises
    useEffect(() => {
        if (facebookAccount && files)
            analyzeFile(files[0], facebookAccount).then((fileAnalysis) =>
                setFileAnalysis(fileAnalysis)
            );
    }, [facebookAccount, files]);

    return (
        <FileLoaderContext.Provider value={{ fileAnalysis }}>
            {children}
        </FileLoaderContext.Provider>
    );
};
