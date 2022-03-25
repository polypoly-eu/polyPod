import React, { useEffect, useState } from "react";

import { RefreshFilesError } from "../errors/polyIn-errors.js";
import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";
import { analyzeFile } from "../model/analysis.js";
import { importData } from "../model/importer.js";

export const ImporterContext = React.createContext();

//used until real storage is loaded
const fakeStorage = {
    files: null,
    refreshFiles: async () => null,
    readFile: async () => null,
    removeFile: async () => {},
};

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

    const history = useHistory();
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

    function handleBack() {
        if (history.length > 1) {
            history.goBack();
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
                handleBack,
                fileAnalysis,
                refreshFiles,
                activeDetails,
                setActiveDetails,
                globalError,
                setGlobalError,
                facebookAccount,
                reportResult,
                setReportResult,
                isLoading,
                setIsLoading,
                runWithLoadingScreen,
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
