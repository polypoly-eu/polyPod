import React, { useRef } from "react";
import i18n from "../../i18n.js";
import RouteButton from "../buttons/routeButton.jsx";
import InfoBox from "../infoBox/infoBox.jsx";
import ScrollButton from "../buttons/scrollButton/scrollButton.jsx";

import "./importExplanationExpandable.css";

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
    importSections,
    importStatus,
    onUpdateImportStatus,
    selectedFile,
    selectFile,
    onImportFile,
    isFiles,
}) => {
    const importRefs = {
        request: useRef(),
        download: useRef(),
        import: useRef(),
        explore: useRef(),
    };

    const expandableRef = useRef();
    const fileInputRef = useRef();

    const handleScrollToSection = () => {
        const refPoint = importRefs[importStatus]?.current;
        if (refPoint)
            refPoint.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    };

    const handleFileSelected = (e) => {
        selectFile(e.target.files[0]);
    };

    const handleClearFile = () => {
        selectFile(null);
        fileInputRef.current.value = null;
    };

    const bodyContent = {
        request: (
            <>
                <p>{i18n.t("import:request.1")}</p>
                <InfoBox textContent={i18n.t("import:request.info.1")} />
                <div className="separator"></div>
                <h4>{i18n.t("import:how.it.works")}</h4>
                <img src="./images/facebook.svg" alt="facebook" />
                <p>{i18n.t("import:request.2")}</p>
                <p>{i18n.t("import:request.3")}</p>
                <img src="./images/document.svg" alt="document" />
                <p>{i18n.t("import:request.4")}</p>
                <img
                    src="./images/json.svg"
                    className="translucent-sides"
                    alt="select-json"
                />
                <InfoBox textContent={i18n.t("import:request.info.2")} />
                <button
                    className="btn-highlighted"
                    onClick={() => onUpdateImportStatus(importSteps.download)}
                >
                    {i18n.t("import:request.button")}
                </button>
            </>
        ),
        download: (
            <>
                <p>{i18n.t("import:download.1")}</p>
                <InfoBox textContent={i18n.t("import:download.info")} />
                <div className="separator"></div>
                <h4>{i18n.t("import:how.it.works")}</h4>
                <img src="./images/letter.svg" alt="facebook" />
                <p>{i18n.t("import:download.2")}</p>
                <img src="./images/download.svg" alt="document" />
                <p>{i18n.t("import:download.3")}</p>
                <button className="btn-highlighted">
                    {i18n.t("import:download.button.1")}
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => onUpdateImportStatus(importSteps.import)}
                >
                    {i18n.t("import:download.button.2")}
                </button>
            </>
        ),
        import: (
            <>
                <p>{i18n.t("import:import")}</p>
                <div className="separator"></div>
                <div className="x-divider">
                    {selectedFile ? (
                        <>
                            <h5>{selectedFile.name}</h5>
                            <div className="align-right">
                                <button
                                    onClick={handleClearFile}
                                    className="delete-button"
                                >
                                    {i18n.t("import:import.delete")}
                                </button>
                            </div>
                        </>
                    ) : (
                        <h5>{i18n.t("import:import.none.chosen")}</h5>
                    )}
                </div>
                <InfoBox textContent={i18n.t("import:import.info")} />
                <button
                    className={`btn-secondary ${
                        selectedFile ? "deactivated" : ""
                    }`}
                    onClick={() => {
                        fileInputRef.current.click();
                    }}
                >
                    {i18n.t("import:import.button.1")}
                </button>
                <button
                    className={`btn-highlighted ${
                        selectedFile ? "" : "deactivated"
                    }`}
                    onClick={onImportFile}
                >
                    {i18n.t("import:import.button.2")}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    id="thefile"
                    onChange={handleFileSelected}
                />
            </>
        ),
        explore: (
            <>
                <p>{i18n.t("import:explore.1")}</p>
                <p>{i18n.t("import:explore.2")}</p>
                {isFiles() ? (
                    <RouteButton
                        className="btn-highlighted"
                        onClick={() =>
                            onUpdateImportStatus(importSteps.finished)
                        }
                        stateChange={{ importStatus: importSteps.finished }}
                        route="/"
                    >
                        {i18n.t("import:explore.button")}
                    </RouteButton>
                ) : (
                    <button className="btn-highlighted deactivated">
                        {i18n.t("import:explore.button")}
                    </button>
                )}
            </>
        ),
    };

    return (
        <div
            ref={expandableRef}
            onLoad={handleScrollToSection}
            className="explanation-expandable"
        >
            <div className="intro">
                <p>{i18n.t("import:intro.text.1")}</p>
                <p className="bold">{i18n.t("import:intro.text.2")}</p>
                <InfoBox textContent={i18n.t("import:intro.info")} />
            </div>
            <ScrollButton scrollRef={expandableRef} />
            {Object.values(importSections).map((section, index) => (
                <div key={index} className={`section ${section}`}>
                    <div
                        onClick={() => onUpdateImportStatus(section)}
                        className="head"
                        ref={importRefs[section]}
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
                            {bodyContent[section]}
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default ImportExplanationExpandable;
