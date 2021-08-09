import React, { useState, useContext, useRef } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";
import i18n from "../../i18n.js";

import "./import.css";

const importSections = ["request", "download", "import", "explore"];

const ProgressBar = ({ onUpdateImportStatus }) => {
    return (
        <div className="progress-bar">
            {importSections.map((section, index) => (
                <div
                    onClick={() => onUpdateImportStatus(section)}
                    key={index}
                    className={`section`}
                >
                    <div className={`line ${section}-progress`}></div>
                </div>
            ))}
        </div>
    );
};

const InfoBox = ({ textContent }) => {
    return (
        <div className="infobox">
            <div className="icon"></div>
            <div className="text-content">{textContent}</div>
        </div>
    );
};

const ScrollButton = () => {
    const scrollingPosition = 20;
    return scrollingPosition < 100 ? (
        <div className="scroll-button">
            <img src="./images/scroll-down.svg" />{" "}
            <p>{i18n.t("import:scroll.button")}</p>
        </div>
    ) : null;
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
            <div className="intro">
                <p>{i18n.t("import:intro.text.1")}</p>
                <p className="bold">{i18n.t("import:intro.text.2")}</p>
                <InfoBox textContent={i18n.t("import:info.1")} />
            </div>
            <ScrollButton />
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
                        <div
                            className="heading"
                            dangerouslySetInnerHTML={{
                                __html: i18n.t(`import:heading.${section}`),
                            }}
                        />
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
            <ProgressBar onUpdateImportStatus={updateImportStatus} />
            <ImportExplanationExpandable
                importSteps={importSteps}
                importStatus={importStatus}
                updateImportStatus={updateImportStatus}
            />
        </div>
    );
};

export default Import;
