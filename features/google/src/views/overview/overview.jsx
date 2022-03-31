import React, { useContext } from "react";
import { GoogleContext } from "../../context/google-context.jsx";

const Overview = () => {
    const { handleSelectFile, files, handleRemoveFile, googleAccount } =
        useContext(GoogleContext);

    const importFile = async () => {
        if (files?.[0]?.id) handleRemoveFile(files[0].id);
        await handleSelectFile();
    };

    return (
        <div className="overview poly-theme-light">
            <button className="btn secondary" onClick={() => importFile()}>
                Import File
            </button>
            <div>
                {googleAccount?.pathNames.map((entry, i) => (
                    <div key={i}>{entry.path}</div>
                )) || null}
            </div>
        </div>
    );
};

export default Overview;
