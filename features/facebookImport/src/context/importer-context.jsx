import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory } from "react-router-dom";
import { analyzeFile } from "../model/analysis.js";
import { importData } from "../importer/importer.js";

export const ImporterContext = React.createContext();

//all nav-states for checking purposes
const navigationStates = ["importStatus"];
const importSteps = {
    loading: "loading",
    beginning: "beginning",
    request: "request",
    download: "download",
    import: "import",
    explore: "explore",
    finished: "finished",
};
const namespace = "http://polypoly.coop/schema/fbImport/";

function updatePodNavigation(pod, history) {
    pod.polyNav.actions = {
        back: () => history.goBack(),
    };
    history.length > 1
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

    //storage
    const storage = pod
        ? new Storage(pod)
        : {
              files: [],
              refreshFiles: async () => [],
              readFile: async () => null,
              removeFile: async () => {},
          };
    const [files, setFiles] = useState([]);
    const [facebookAccount, setFacebookAccount] = useState(null);
    const [fileAnalysis, setFileAnalysis] = useState(null);

    storage.changeListener = async () => {
        const resolvedFiles = [];
        for (const file of storage.files) {
            resolvedFiles.push(await file);
        }
        setFiles(Object.values(resolvedFiles));
    };

    const [navigationState, setNavigationState] = useState({
        importStatus: importSteps.loading,
    });

    const history = useHistory();

    const handleRemoveFile = (fileID) => {
        setFacebookAccount(null);
        storage.removeFile(fileID);
    };

    //change the navigationState like so: changeNavigationState({<changedState>:<changedState>})
    function changeNavigationState(changedState) {
        if (changedState) {
            Object.keys(changedState)?.forEach((key) => {
                if (!navigationStates.includes(key)) {
                    console.log(`NavigationStateError with key: ${key}`);
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
        storage.refreshFiles().then(async () => {
            const resolvedFiles = [];
            for (const file of storage.files) {
                resolvedFiles.push(await file);
            }
            setFiles(resolvedFiles);
        });
    }

    function importFile() {
        return storage.importFile();
    }

    function updateImportStatus(newStatus) {
        changeNavigationState({ importStatus: newStatus });
        writeImportStatus(pod, newStatus);
    }

    async function initPod() {
        const pod = await window.pod;
        // TODO: This is a workaround for a race condition on Android, where
        //       messages were being sent to the pod before it was fully
        //       initialised. We have to solve the root cause of this.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(pod);
            }, 100);
        });
    }

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
            refreshFiles();
        });
    }, []);

    // On file change
    // When files changed run the importer first and create an account model first.
    // After there is an account the analyses are triggered.
    useEffect(() => {
        if (files[0])
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
        updatePodNavigation(pod, history);
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
                importSteps,
                updateImportStatus,
                importFile,
                fileAnalysis,
                refreshFiles,
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
