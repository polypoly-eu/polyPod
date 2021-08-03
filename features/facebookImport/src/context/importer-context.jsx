import React, { useState } from "react";

import Storage from "../model/storage.js";

export const ImporterContext = React.createContext();

async function initPod() {
    return await window.pod;
}

export const ImporterProvider = ({ children }) => {
    //state
    const [pod, setPod] = useState(null);
    const [files, setFiles] = useState([]);

    //storage and pod initialisation
    let storage = null;
    initPod().then((pod) => {
        setPod(pod);
        storage = new Storage(pod);
        storage.refreshFiles();
        storage.changeListener = () => {
            setFiles(Object.values(storage.files));
        };
    });

    const handleRemoveFile = (fileID) => {
        console.log("remove");
        //this._storage.removeFile(event.detail);
    };

    return (
        <ImporterContext.Provider
            value={{
                pod,
                files,
                handleRemoveFile,
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
