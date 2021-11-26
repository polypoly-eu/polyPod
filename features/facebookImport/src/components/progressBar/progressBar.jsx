import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./progressBar.css";

const ProgressBar = ({
    onUpdateImportStatus,
    importStatus,
    importSections,
    file,
}) => {
    return (
        <div className="progress-bar" id="progress-bar">
            {importSections.map((section, index) => (
                <div
                    onClick={() => onUpdateImportStatus(section)}
                    key={index}
                    className={`section`}
                >
                    <div className={`line ${section}-progress`}>
                        <div className={`number ${section}-number`}>
                            {index + 1}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
