import React, { useState, useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import ProgressBarComponent from "../../components/progressBar/progressBar.jsx";
import ImportExplanationExpandable from "../../components/importExplanationExpandable/importExplanationExpandable.jsx";

import "./import.css";

//These are just the sections that are shown as a visual part of the import
//importSteps are all steps like loading and finished that have logical relevance for the process
const importSections = ["request", "download", "import", "explore"];

const Import = () => {
    const { importSteps, navigationState, updateImportStatus, addFile, files } =
        useContext(ImporterContext);
    const importStatus = navigationState.importStatus;

    const [selectedFile, selectFile] = useState(null);

    const handleImportFile = () => {
        const { polyNav } = window.pod;
        selectFile(polyNav.importFile());
        updateImportStatus(importSteps.explore);
    };

    const isFiles = () => {
        return files.length > 0 ? true : false;
    };

    return (
        <div className="import-view">
            <ProgressBarComponent
                onUpdateImportStatus={updateImportStatus}
                importStatus={importStatus}
                importSections={importSections}
            />
            <ImportExplanationExpandable
                importSteps={importSteps}
                importSections={importSections}
                importStatus={importStatus}
                selectedFile={selectedFile}
                selectFile={selectFile}
                onImportFile={handleImportFile}
                onUpdateImportStatus={updateImportStatus}
                isFiles={isFiles}
            />
        </div>
    );
};

export default Import;
