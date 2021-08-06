import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";

export const ImporterContext = React.createContext();

//constants
const pod = window.pod;
let files = [];
const storage = new Storage(pod);
storage.refreshFiles();
storage.changeListener = () => {
    files = Object.values(storage.files);
};

//all nav-states for checking purposes
const navigationStates = ["importStatus"];
const importSteps = {
    request: "request",
    download: "download",
    import: "import",
    explore: "explore",
};
const namespace = "http://polypoly.coop/schema/facebookImporter/#";

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
    let status = statusQuads[0]?.object?.value?.split("#")[1];
    return status || importSteps.request;
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
    const [navigationState, setNavigationState] = useState({
        importStatus:
            files.length > 0 ? importSteps.explore : importSteps.request,
    });

    const history = useHistory();

    const handleRemoveFile = (fileID) => {
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
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
