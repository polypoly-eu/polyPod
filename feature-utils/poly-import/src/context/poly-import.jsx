import React, { createContext, useContext, useEffect, useState } from "react";
import { FeatureFileStorage } from "../storage";
import { importData } from "../importer";

import { RefreshFilesError } from "../errors/polyIn-errors.js";

//used until real storage is loaded
const fakeStorage = {
    files: null,
    refreshFiles: async () => null,
    readFile: async () => null,
    removeFile: async () => {},
};

export const PolyImportContext = createContext();

export const PolyImportProvider = ({
    children,
    parentContext,
    analyzeFile,
    dataImporters,
    DataAccount,
}) => {
    const { pod, setIsLoading, setGlobalError } = useContext(parentContext);

    const [storage, setStorage] = useState(fakeStorage);
    const [files, setFiles] = useState(null);
    const [account, setAccount] = useState(null);
    const [fileAnalysis, setFileAnalysis] = useState(null);

    function refreshFiles() {
        setIsLoading(true);
        storage
            .refreshFiles()
            .then(async () => {
                const resolvedFiles = [];
                if (!storage.files) {
                    setFiles(null);
                    return;
                }
                for (const file of storage.files) {
                    resolvedFiles.push(await file);
                }
                setFiles(resolvedFiles);
                setIsLoading(false);
            })
            .catch((error) => setGlobalError(new RefreshFilesError(error)));
    }

    const handleRemoveFile = (fileID) => {
        setAccount(null);
        return storage.removeFile(fileID);
    };

    useEffect(() => {
        if (!pod) return;
        const storage = new FeatureFileStorage(pod);
        storage.changeListener = async () => {
            const resolvedFiles = [];
            for (const file of storage.files) {
                resolvedFiles.push(await file);
            }
            setFiles(Object.values(resolvedFiles));
        };
        setStorage(storage);
    }, [pod]);

    //on storage change
    useEffect(() => {
        refreshFiles();
    }, [storage]);

    //on file change
    //when files changed run the importer first and create an account model first.
    //after there is an account the analyses are triggered.
    useEffect(() => {
        if (!files?.[0]) return;
        importData({ dataImporters, zipData: files[0], DataAccount }).then(
            (newAccount) => {
                setAccount(newAccount);
                analyzeFile(files[0], newAccount).then((fileAnalysis) =>
                    setFileAnalysis(fileAnalysis)
                );
            }
        );
    }, [files]);

    return (
        <PolyImportContext.Provider
            value={{
                files,
                fileAnalysis,
                account,
                handleRemoveFile,
                refreshFiles,
            }}
        >
            {children}
        </PolyImportContext.Provider>
    );
};
