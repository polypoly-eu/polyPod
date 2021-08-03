import React, { useState } from "react";

import Storage from "../model/storage.js";

const ImporterContext = React.createContext();

async function initPod() {
    return await window.pod;
}

export const ContextProvider = ({ children }) => {
    const pod = window.pod;
    const storage = new Storage(pod);
    storage.refreshFiles();
    storage.changeListener();
    const files = Object.values(storage);

    return (
        <ImporterContext.Provider value={{}}>
            {children}
        </ImporterContext.Provider>
    );
};
