import React, { useEffect, useState } from "react";

import { RefreshFilesError } from "../errors/polyIn-errors.js";
import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";

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
                refreshFiles,
                globalError,
                setGlobalError,
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
