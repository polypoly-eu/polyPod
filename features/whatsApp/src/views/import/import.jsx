import React, { useState } from "react";
import { Screen, ProgressBar } from "@polypoly-eu/poly-look";
import ImportExplanationExpandable from "../../components/importExplanationExpandable/importExplanationExpandable.jsx";

import "./import.css";

const importSections = ["request", "download", "import", "explore"];

const importSteps = {
    beginning: "beginning",
    request: "request",
    download: "download",
    import: "import",
    explore: "explore",
};

const ImportView = () => {
    const [importStatus, setImportStatus] = useState(importSteps.beginning);

    function updateImportStatus(status) {
        setImportStatus(status);
    }

    return (
        <Screen
            className="import-view poly-theme-light"
            layout="poly-standard-layout"
        >
            <ProgressBar
                onUpdateImportStatus={updateImportStatus}
                importSections={importSections}
            />
            <ImportExplanationExpandable
                importSteps={importSteps}
                importSections={importSections}
                importStatus={importStatus}
                onUpdateImportStatus={updateImportStatus}
            />
        </Screen>
    );
};

export default ImportView;
