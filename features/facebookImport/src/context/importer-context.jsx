import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";
import { analyzeFile } from "../model/analysis.js";
import { importData } from "../model/importer.js";

export const ImporterContext = React.createContext();

//all nav-states for checking purposes
const navigationStates = ["importStatus", "exploreScrollingProgress"];
const importSteps = {
    loading: "loading",
    beginning: "beginning",
    request: "request",
    download: "download",
    import: "import",
    explore: "explore",
};
const namespace = "http://polypoly.coop/schema/fbImport/";
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

function updateTitle(pod) {
    pod.polyNav.setTitle(i18n.t(`common:title`));
}

//from storage
async function readImportStatus(pod) {
    const { dataFactory } = pod;
    const statusQuads = await pod.polyIn.select({
        subject: dataFactory.namedNode(`${namespace}facebookImporter`),
        predicate: dataFactory.namedNode(`${namespace}importStatus`),
    });
    let status = statusQuads[0]?.object?.value?.split(namespace)[1];
    return status || importSteps.beginning;
}

async function writeImportStatus(pod, status) {
    const { dataFactory, polyIn } = pod;
    const existingQuad = (
        await pod.polyIn.select({
            subject: dataFactory.namedNode(`${namespace}facebookImporter`),
            predicate: dataFactory.namedNode(`${namespace}importStatus`),
        })
    )[0];
    polyIn.delete(existingQuad);
    const quad = dataFactory.quad(
        dataFactory.namedNode(`${namespace}facebookImporter`),
        dataFactory.namedNode(`${namespace}importStatus`),
        dataFactory.namedNode(`${namespace}${status}`)
    );
    polyIn.add(quad);
}

export const ImporterProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [storage, setStorage] = useState(fakeStorage);
    const [files, setFiles] = useState(null);
    const [facebookAccount, setFacebookAccount] = useState(null);
    const [fileAnalysis, setFileAnalysis] = useState(null);
    const [activeDetails, setActiveDetails] = useState(null);
    const [globalError, setGlobalError] = useState(null);
    const [reportResult, setReportResult] = useState(null);

    const [navigationState, setNavigationState] = useState({
        importStatus: importSteps.loading,
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

    const history = useHistory();

    const handleRemoveFile = (fileID) => {
        setFacebookAccount(null);
        return storage.removeFile(fileID);
    };

    const handleImportFile = async () => {
        const { polyNav } = pod;
        setFiles(null); // To show the loading overlay
        try {
            await polyNav.importFile();
        } catch (error) {
            setGlobalError(new FileImportError(error));
        }
        refreshFiles();
    };

    //change the navigationState like so: changeNavigationState({<changedState>:<changedState>})
    function changeNavigationState(changedState) {
        if (changedState) {
            Object.keys(changedState)?.forEach((key) => {
                if (!navigationStates.includes(key)) {
//                  console.log(`NavigationStateError with key: ${key}`);
                    return;
                }
            });
            setNavigationState({ ...navigationState, ...changedState });
        }
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

    function updateImportStatus(newStatus) {
        changeNavigationState({ importStatus: newStatus });
        writeImportStatus(pod, newStatus);
    }

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
            readImportStatus(newPod).then((status) => {
                if (
                    status &&
                    !(navigationState.importStatus == importSteps.explore)
                )
                    changeNavigationState({ importStatus: status });
            });
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
        if (!pod) return;
        updatePodNavigation(pod, history, handleBack, location);
        updateTitle(pod);
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
                handleImportFile,
                importSteps,
                updateImportStatus,
                fileAnalysis,
                refreshFiles,
                activeDetails,
                setActiveDetails,
                globalError,
                setGlobalError,
                facebookAccount,
                reportResult,
                setReportResult,
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
