import React, { useEffect, useState } from "react";
import { FeatureFileStorage } from "@polypoly-eu/feature-storage";
import { useHistory, useLocation } from "react-router-dom";
import { importData } from "../model/importer";

export const GoogleContext = React.createContext();

//used until real storage is loaded
const fakeStorage = {
    files: null,
    refreshFiles: async () => null,
    readFile: async () => null,
    removeFile: async () => {},
};

class RefreshFilesError extends Error {
    constructor(cause) {
        super("Failed to refresh files");
        this.name = "RefreshFilesError";
        this.cause = cause;
    }
}

class FileImportError extends Error {
    constructor(cause) {
        super("Failed to import file");
        this.name = "FileImportError";
        this.cause = cause;
    }
}

class FileSelectionError extends Error {
    constructor(cause) {
        super("Failed to select file");
        this.name = "FileSelectionError";
        this.cause = cause;
    }
}

function updatePodNavigation(pod, history, handleBack, location) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    history.length > 1 &&
    location.pathname !== "/overview" &&
    location.pathname !== "/import"
        ? pod.polyNav.setActiveActions(["back"])
        : pod.polyNav.setActiveActions([]);
}

export const GoogleContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [files, setFiles] = useState(null);
    const [storage, setStorage] = useState(fakeStorage);
    const [globalError, setGlobalError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [googleAccount, setGoogleAccount] = useState(null);

    const location = useLocation();
    const initPod = async () => await window.pod;
    const history = useHistory();

    function handleBack() {
        if (history.length > 1) {
            history.goBack();
        }
    }

    async function runWithLoadingScreen(task) {
        setFiles(null);
        await task();
        refreshFiles();
    }

    const handleSelectFile = async () => {
        const { polyNav } = pod;
        runWithLoadingScreen(async function () {
            try {
                setSelectedFile(await polyNav.pickFile("application/zip"));
            } catch (error) {
                setGlobalError(new FileSelectionError(error));
            }
        });
    };

    const handleRemoveFile = (fileID) => {
        return storage.removeFile(fileID);
    };

    const handleImportFile = async () => {
        if (!selectedFile) return;
        const { polyOut } = pod;
        console.log("handleImportFile: ", selectedFile.url);
        runWithLoadingScreen(async function () {
            try {
                await polyOut.importArchive(selectedFile.url);
                setSelectedFile(null);
            } catch (error) {
                setGlobalError(new FileImportError(error));
            }
        });
    };

    function refreshFiles() {
        setFiles(null);
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
            })
            .catch((error) => setGlobalError(new RefreshFilesError(error)));
    }

    storage.changeListener = async () => {
        const resolvedFiles = [];
        for (const file of storage.files) {
            resolvedFiles.push(await file);
        }
        setFiles(Object.values(resolvedFiles));
    };

    useEffect(() => {
        if (files?.[0])
            importData(files[0]).then((newGoogleAccount) =>
                setGoogleAccount(newGoogleAccount)
            );
    }, [files]);

    //on storage change
    useEffect(() => {
        refreshFiles();
    }, [storage]);

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
            setStorage(new FeatureFileStorage(newPod));
        });
    }, []);

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
        });
    }, []);

    //on history change
    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, history, handleBack, location);
    });

    useEffect(() => {
        if (!selectedFile) return;
        handleImportFile(selectedFile);
    }, [selectedFile]);

    useEffect(() => {
        if (files?.[0]) importData(files[0]);
    }, [files]);

    return (
        <GoogleContext.Provider
            value={{
                pod,
                files,
                handleSelectFile,
                handleRemoveFile,
                handleImportFile,
                globalError,
                setGlobalError,
                googleAccount,
            }}
        >
            {children}
        </GoogleContext.Provider>
    );
};
