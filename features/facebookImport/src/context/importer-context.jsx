import React from "react";

import Storage from "../model/storage.js";

export const ImporterContext = React.createContext();

export const ImporterProvider = ({ children }) => {
    const pod = window.pod;
    const storage = new Storage(pod);
    storage.refreshFiles();
    storage.changeListener();
    let files = [];
    storage.changeListener = () => {
        files = Object.values(storage.files);
    };

    return (
        <ImporterContext.Provider value={{ pod, files }}>
            {children}
        </ImporterContext.Provider>
    );
};
