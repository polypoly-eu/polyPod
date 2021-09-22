import React from "react";

import "./progressBar.css";

const ProgressBar = ({
    onUpdateImportStatus,
    importStatus,
    importSections,
}) => {
    function checkForIcon(section) {
        if (
            importSections.indexOf(importStatus) >
            importSections.indexOf(section)
        )
            return <img src={`./images/${section}-done.svg`} />;
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
                        {checkForIcon(section)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
