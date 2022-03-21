import React, { useContext } from "react";
import { GoogleContext } from "../../context/google-context.jsx";

const Overview = () => {
    const { handleSelectFile, handleImportFile, files } =
        useContext(GoogleContext);
    const importFile = async () => {
        await handleSelectFile();
        await handleImportFile();
    };
    return (
        <div className="overview poly-theme-light">
            <button className="btn secondary" onClick={() => importFile()}>
                Import File
            </button>
            <div>{files?.[0].name}</div>
        </div>
    );
};

export default Overview;
