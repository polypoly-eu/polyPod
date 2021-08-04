import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";
import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";

export const ImporterContext = React.createContext();

async function initPod() {
    return await window.pod;
}

async function initStorage(setPod, setFiles, setStorage) {
    initPod().then((pod) => {
        setPod(pod);
        const storage = new Storage(pod);
        storage.refreshFiles();
        storage.changeListener = () => {
            setFiles(Object.values(storage.files));
        };
        setStorage(storage);
    });
}

function updatePodNavigation(pod, history) {
    if (pod) {
        pod.polyNav.actions = {
            back: () => history.goBack(),
        };
        history.length > 1
            ? pod.polyNav.setActiveActions(["back"])
            : pod.polyNav.setActiveActions([]);
    }
}

function updateTitle(pod) {
    if (pod) pod.polyNav.setTitle(i18n.t(`common:title`));
}

export const ImporterProvider = ({ children }) => {
    //state
    const [pod, setPod] = useState(null);
    const [files, setFiles] = useState([]);
    const [storage, setStorage] = useState(null);

    // Adding an empty navigationState here since routing-changes alone don't rerender the components, which we need for title updates etc
    // Also I'm sure navigationStates will soon come up in further development (delete this comment then)
    // See how this works with navigationStates in the polyExplorer-features for reference
    const [navigationState, setNavigationState] = useState({});

    const history = useHistory();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleRemoveFile = (fileID) => {
        storage.removeFile(fileID);
    };

    //change the navigationState like so: changeNavigationState({<changedState>:<changedState>})
    function changeNavigationState(changedState) {
        if (changedState) {
            Object.keys(changedState).forEach((key) => {
                if (!navigationStates.includes(key)) {
                    console.log(`NavigationStateError with key: ${key}`);
                    return;
                }
            });
            setNavigationState({ ...navigationState, ...changedState });
        }
    }

    function handleBack() {
        if (currentPath != "/overview") {
            history.goBack();
            if (history.location.state) {
                changeNavigationState(history.location.state);
            }
        }
    }

    //on startup
    useEffect(() => {
        initStorage(setPod, setFiles, setStorage);
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
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
