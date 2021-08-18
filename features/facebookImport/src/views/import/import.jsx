import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import ProgressBarComponent from "../../components/progressBar/progressBar.jsx";
import ImportExplanationExpandable from "../../components/importExplanationExpandable/importExplanationExpandable.jsx";

import "./import.css";

//These are just the sections that are shown as a visual part of the import
//importSteps are all steps like loading and finished that have logical relevance for the process
const importSections = ["request", "download", "import", "explore"];

const Import = () => {
    const {
        importSteps,
        navigationState,
        updateImportStatus,
        files,
        refreshFiles,
        handleRemoveFile,
    } = useContext(ImporterContext);
    const importStatus = navigationState.importStatus;
    const file = files[0];

    const handleImportFile = async () => {
        const { polyNav } = window.pod;
        await polyNav.importFile();
        refreshFiles();
    };

    const onRemoveFile = () => {
        handleRemoveFile(file.id);
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
                onImportFile={handleImportFile}
                onUpdateImportStatus={updateImportStatus}
                file={file}
                onRemoveFile={onRemoveFile}
            />
        </div>
    );
};

export default Import;
