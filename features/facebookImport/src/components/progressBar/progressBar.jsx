import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./progressBar.css";

const ProgressBar = ({
    onUpdateImportStatus,
    importStatus,
    importSections,
    file,
}) => {
    const { startRequest } = useContext(ImporterContext);

    function requestCheckIcon() {
        if (startRequest || file) {
            return <img src={`./images/request-done.svg`} />;
        } else {
            return <div className={`number request-number`}>1</div>;
        }
    }

    function checkForIcon(section) {
        if (
            section !== "request" &&
            importSections.indexOf(importStatus) >
                importSections.indexOf(section)
        ) {
            return <img src={`./images/${section}-done.svg`} />;
        }
        if (
            importSections.indexOf(importStatus) ===
            importSections.indexOf(section)
        )
            return (
                <div className={`number ${section}-number`}>
                    {importSections.indexOf(importStatus) + 1}
                </div>
            );
    }

    return (
        <div className="progress-bar" id="progress-bar">
            {importSections.map((section, index) => (
                <div
                    onClick={() => onUpdateImportStatus(section)}
                    key={index}
                    className={`section`}
                >
                    <div className={`line ${section}-progress`}>
                        {section === "request"
                            ? requestCheckIcon()
                            : checkForIcon(section)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
