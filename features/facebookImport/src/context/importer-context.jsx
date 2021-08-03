import React, { useState } from "react";

import Storage from "../model/storage.js";

export const ImporterContext = React.createContext();

async function initPod() {
    return await window.pod;
}

export const ImporterProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    let storage = null;
    let files = [];
    initPod().then((pod) => {
        setPod(pod);
        storage = new Storage(pod);
        storage.refreshFiles();
        storage.changeListener();
        storage.changeListener = () => {
            files = Object.values(storage.files);
        };
    });

    return (
        <ImporterContext.Provider value={{ pod, files }}>
            {children}
        </ImporterContext.Provider>
    );
};
