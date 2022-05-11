import React, { useState } from "react";
import { Screen } from "@polypoly-eu/poly-look";
import ImportExplanationExpandable from "../../components/importExplanationExpandable/importExplanationExpandable.jsx";
// import { GoogleContext } from "../../context/google-context.jsx";
// import { FileSelectionError, FileImportError } from "@polypoly-eu/poly-import";

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
    // const { files } = useContext(PolyImportContext);

    const [importStatus, setImportStatus] = useState(importSteps.beginning);

    function updateImportStatus(status) {
        setImportStatus(status);
        // writeImportStatus(
        //     pod,
        //     status == importSteps.explore ? importSteps.import : status
        // );
    }

    return (
        <Screen className="import" layout="poly-standard-layout">
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
