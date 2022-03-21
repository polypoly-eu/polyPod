import React, { useContext } from "react";
import { GoogleContext } from "../../context/google-context.jsx";

const Overview = () => {
    const { handleSelectFile, handleImportFile } = useContext(GoogleContext);
    const importFile = () => {
        handleSelectFile();
        handleImportFile();
    };
    return (
        <div className="overview">
            <button className="btn secondary" onClick={() => importFile()}>
                Import File
            </button>
        </div>
    );
};

export default Overview;
