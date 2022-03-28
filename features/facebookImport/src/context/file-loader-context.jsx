import React, { createContext, useContext, useEffect, useState } from "react";
import { ImporterContext } from "./importer-context.jsx";
import { analyzeFile } from "../model/analysis.js";
import { importData } from "../model/importer.js";

export const FileLoaderContext = createContext();

export const FileLoaderProvider = ({ children }) => {
    const { files } = useContext(ImporterContext);

    const [facebookAccount, setFacebookAccount] = useState(null);
    const [fileAnalysis, setFileAnalysis] = useState(null);

    //on file change
    //when files changed run the importer first and create an account model first.
    //after there is an account the analyses are triggered.
    useEffect(() => {
        if (files?.[0])
            importData(files[0]).then((newFacebookAccount) =>
                setFacebookAccount(newFacebookAccount)
            );
    }, [files]);

    // On account changed
    // When the account changes run the analises
    useEffect(() => {
        if (facebookAccount && files)
            analyzeFile(files[0], facebookAccount).then((fileAnalysis) =>
                setFileAnalysis(fileAnalysis)
            );
    }, [facebookAccount, files]);

    return (
        <FileLoaderContext.Provider value={{ fileAnalysis, facebookAccount }}>
            {children}
        </FileLoaderContext.Provider>
    );
};
