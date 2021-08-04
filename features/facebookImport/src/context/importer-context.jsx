import React, { useEffect, useState } from "react";

import Storage from "../model/storage.js";

export const ImporterContext = React.createContext();

async function initPod(setPod, setFiles, setStorage) {
    (await window.pod).then((pod) => {
        setPod(pod);
        const storage = new Storage(pod);
        storage.refreshFiles();
        storage.changeListener = () => {
            setFiles(Object.values(storage.files));
        };
        setStorage(storage);
    });
}

export const ImporterProvider = ({ children }) => {
    //state
    const [pod, setPod] = useState(null);
    const [files, setFiles] = useState([]);
    const [storage, setStorage] = useState(null);

    const handleRemoveFile = (fileID) => {
        console.log("remove");
        //this._storage.removeFile(event.detail);
    };

    //on startup
    useEffect(() => {
        initPod(setPod, setFiles, setStorage);
    }, []);

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
