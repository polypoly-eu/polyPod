import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory } from "react-router-dom";

export const ImporterContext = React.createContext();

const pod = window.pod;

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
async function readImportStatus() {
    const statusQuads = await pod.polyIn.select({
        subject: { value: `${namespace}facebookImporter` },
        predicate: { value: `${namespace}importStatus` },
    });
    let status = statusQuads[0]?.object?.value?.split(namespace)[1];
    return status || importSteps.beginning;
}

async function writeImportStatus(status) {
    const { dataFactory, polyIn } = pod;
    const existingQuad = (
        await pod.polyIn.select({
            subject: { value: `${namespace}facebookImporter` },
            predicate: { value: `${namespace}importStatus` },
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
    //storage
    const storage = new Storage(pod);
    const [files, setFiles] = useState([]);
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
        storage.removeFile({ id: fileID });
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
        writeImportStatus(newStatus);
    }

    //on startup
    useEffect(() => {
        readImportStatus().then((status) => {
            if (
                status &&
                !(navigationState.importStatus == importSteps.explore)
            )
                changeNavigationState({ importStatus: status });
        });
        refreshFiles();
    }, []);

    //on history change
    useEffect(() => {
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
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
