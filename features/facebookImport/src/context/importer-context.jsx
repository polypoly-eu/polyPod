import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";
import { analyzeFile } from "../model/analysis.js";
import { importData } from "../model/importer.js";

export const ImporterContext = React.createContext();

//all nav-states for checking purposes
const navigationStates = ["exploreScrollingProgress"];

//used until real storage is loaded
const fakeStorage = {
    files: null,
    refreshFiles: async () => null,
    readFile: async () => null,
    removeFile: async () => {},
};

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

class RefreshFilesError extends Error {
    constructor(cause) {
        super("Failed to refresh files");
        this.name = "RefreshFilesError";
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

function updateTitle(pod, location) {
    pod.polyNav.setTitle(
        location.pathname === "/"
            ? ""
            : location.pathname.endsWith("info")
            ? i18n.t("navbarTitles:info")
            : i18n.t(`navbarTitles:${location.pathname.substring(1)}`)
    );
}

export const ImporterProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [storage, setStorage] = useState(fakeStorage);
    const [files, setFiles] = useState(null);
    const [facebookAccount, setFacebookAccount] = useState(null);
    const [fileAnalysis, setFileAnalysis] = useState(null);
    const [activeDetails, setActiveDetails] = useState(null);
    const [globalError, setGlobalError] = useState(null);
    const [reportResult, setReportResult] = useState(null);
    const [startRequest, setStartRequest] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    //navigation
    const history = useHistory();
    const [navigationState, setNavigationState] = useState({
        exploreScrollingProgress: 0,
    });

    const location = useLocation();

    storage.changeListener = async () => {
        const resolvedFiles = [];
        for (const file of storage.files) {
            resolvedFiles.push(await file);
        }
        setFiles(Object.values(resolvedFiles));
    };

    async function runWithLoadingScreen(task) {
        setIsLoading(true);
        await task();
        setIsLoading(false);
    }

    const handleRemoveFile = (fileID) => {
        setFacebookAccount(null);
        return storage.removeFile(fileID);
    };

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

    const handleImportFile = async () => {
        if (!selectedFile) return;
        const { polyOut } = pod;
        runWithLoadingScreen(async function () {
            try {
                await polyOut.importArchive(selectedFile.url);
                setSelectedFile(null);
            } catch (error) {
                setGlobalError(new FileImportError(error));
            }
        });
    };

    //change the navigationState like so: changeNavigationState({<changedState>:<changedState>})
    function changeNavigationState(changedState) {
        if (!changedState) return;
        Object.keys(changedState)?.forEach((key) => {
            if (!navigationStates.includes(key)) {
                console.error(`NavigationStateError with key: ${key}`);
                return;
            }
        });
        setNavigationState({ ...navigationState, ...changedState });
    }

    function handleBack() {
        if (history.length > 1) {
            history.goBack();
            if (history.location.state) {
                changeNavigationState(history.location.state);
            }
        }
    }

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

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
            setStorage(new Storage(newPod));
        });
    }, []);

    //on storage change
    useEffect(() => {
        refreshFiles();
    }, [storage]);

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

    //on history change
    useEffect(() => {
        console.log(history);
        if (!pod) return;
        updatePodNavigation(pod, history, handleBack, location);
        updateTitle(pod, location);
    });

    return (
        <ImporterContext.Provider
            value={{
                pod,
                files,
                handleRemoveFile,
                navigationState,
                changeNavigationState,
                handleBack,
                selectedFile,
                setSelectedFile,
                handleSelectFile,
                handleImportFile,
                fileAnalysis,
                refreshFiles,
                activeDetails,
                setActiveDetails,
                globalError,
                setGlobalError,
                facebookAccount,
                reportResult,
                setReportResult,
                startRequest,
                setStartRequest,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
