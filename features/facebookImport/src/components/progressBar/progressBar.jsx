import React from "react";

import "./progressBar.css";

const ProgressBar = ({ onUpdateImportStatus, importSections }) => {
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
