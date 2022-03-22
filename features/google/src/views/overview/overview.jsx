import React, { useContext } from "react";
import { GoogleContext } from "../../context/google-context.jsx";

const Overview = () => {
    const { handleSelectFile, files, handleRemoveFile } =
        useContext(GoogleContext);

    const importFile = async () => {
        if (files?.[0]?.id) handleRemoveFile(files[0].id);
        console.log(files);
        await handleSelectFile();
    };

    return (
        <div className="overview poly-theme-light">
            <button className="btn secondary" onClick={() => importFile()}>
                Import File
            </button>
            <div>{files?.[0]?.name}</div>
        </div>
    );
};

export default Overview;
