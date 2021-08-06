import React, { useState, useContext, useRef } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";
import i18n from "../../i18n.js";

import "./import.css";

const importSections = ["request", "download", "import", "explore"];

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

const isSectionOpened = (section, importStatus, importSteps) => {
    return {
        request:
            section == importStatus || importStatus == importSteps.beginning,
        download: section == importStatus,
        import: section == importStatus,
        explore: section == importStatus,
    }[section];
};

const ImportExplanationExpandable = ({
    importSteps,
    importStatus,
    updateImportStatus,
}) => {
    const importRefs = {
        request: useRef(),
        download: useRef(),
        import: useRef(),
        explore: useRef(),
    };

    const refPoint = importRefs[importStatus]?.current;
    if (refPoint)
        refPoint.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

    return (
        <div className="explanation-expandable">
            {importStatus == importSteps.beginning ? (
                <div className="intro">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                    sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua.
                </div>
            ) : null}
            {Object.values(importSections).map((section, index) => (
                <div
                    key={index}
                    className={`section ${section}`}
                    ref={importRefs[section]}
                >
                    <div
                        onClick={() => updateImportStatus(section)}
                        className="head"
                    >
                        <div className={`number ${section}`}>{index + 1}</div>
                        <div className="heading"></div>
                    </div>
                    {isSectionOpened(section, importStatus, importSteps) ? (
                        <div className="body">
                            <div className="separator" />
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no
                            sea takimata sanctus est Lorem ipsum dolor sit amet.
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua.
                        </div>
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
                importSteps={importSteps}
                importStatus={importStatus}
                updateImportStatus={updateImportStatus}
            />
        </div>
    );
};

export default Import;
