import React, { useState, useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";
import i18n from "../../i18n.js";

import "./import.css";

const ProgressBar = ({ sections }) => {
    return (
        <div className="progress-bar">
            {Object.values(sections).map((section, index) => (
                <div key={index} className={`section`}>
                    <div className={`line ${section}-progress`}></div>
                </div>
            ))}
        </div>
    );
};

const ImportExplanationExpandable = ({ sections, openedAtStart }) => {
    const [openedSection, setOpenedSection] = useState(openedAtStart);
    return (
        <div className="explanation-expandable">
            {Object.values(sections).map((section, index) => (
                <div key={index} className={`section ${section}`}>
                    <div
                        onClick={() => setOpenedSection(section)}
                        className="head"
                    >
                        <div className={`number ${section}`}>{index + 1}</div>
                        <div className="heading"></div>
                    </div>
                    {section == openedSection ? (
                        <div className="body"></div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

const Import = () => {
    const { importSteps, navigationState, updateImportStatus } =
        useContext(ImporterContext);
    const importStatus = navigationState.importStatus;
    return (
        <div className="import-view">
            <ProgressBar sections={importSteps} />
            <ImportExplanationExpandable
                sections={importSteps}
                openedAtStart={importStatus}
                updateImportStatus={updateImportStatus}
            />
        </div>
    );
};

export default Import;
