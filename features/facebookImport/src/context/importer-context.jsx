import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";

export const ImporterContext = React.createContext();

//constants
const importSteps = {
    request: "request",
    download: "download",
    import: "import",
    finished: "finished",
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
    const quads = await pod.polyIn.select({});
    const status = quads.some(
        ({ subject, predicate }) =>
            subject.value === `${namespace}facebookImporter` &&
            predicate.value === `${namespace}firstRun`
    );
    return status || null;
}

//logically
function determineImportStatus() {
    return readImportStatus() || importSteps.request;
}

async function writeImportStatus(status) {
    const { dataFactory, polyIn } = pod;
    const quad = dataFactory.quad(
        dataFactory.namedNode(`${namespace}facebookImporter`),
        dataFactory.namedNode(`${namespace}importStatus`),
        dataFactory.namedNode(`${namespace}${status}`)
    );
    polyIn.add(quad);
}

export const ImporterProvider = ({ children }) => {
    const pod = window.pod;
    let files = [];
    const storage = new Storage(pod);
    storage.refreshFiles();
    storage.changeListener = () => {
        files = Object.values(storage.files);
    };

    // Adding an empty navigationState here since routing-changes alone don't rerender the components, which we need for title updates etc
    // Also I'm sure navigationStates will soon come up in further development (delete this comment then)
    // See how this works with navigationStates in the polyExplorer-features for reference
    const [navigationState, setNavigationState] = useState({
        importStatus: determineImportStatus(),
    });

    const history = useHistory();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleRemoveFile = (fileID) => {
        storage.removeFile(fileID);
    };

    //change the navigationState like so: changeNavigationState({<changedState>:<changedState>})
    function changeNavigationState(changedState) {
        if (changedState) {
            Object.keys(changedState)?.forEach((key) => {
                if (!navigationState.includes(key)) {
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

    //on startup
    useEffect(() => {
        determineImportStatus(pod);
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
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
