import React, { useState, useContext, useRef } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";
import i18n from "../../i18n.js";

import "./import.css";

const importSections = ["request", "download", "import", "explore"];

const ProgressBar = ({ onUpdateImportStatus, importStatus }) => {
    function checkForIcon(section) {
        if (
            importSections.indexOf(importStatus) >
            importSections.indexOf(section)
        )
            return <img src={`./images/${section}-done.svg`} />;
    }

    return (
        <div className="progress-bar">
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

const InfoBox = ({ textContent }) => {
    return (
        <div className="infobox">
            <img src="./images/info-circle.svg" alt="" className="icon" />
            <div className="text-content">{textContent}</div>
        </div>
    );
};

const ScrollButton = ({ scrollRef }) => {
    const [scrollingPosition, setScrollingPosition] = useState(0);
    if (scrollRef.current)
        scrollRef.current.addEventListener("scroll", (e) =>
            setScrollingPosition(e.target.scrollTop)
        );
    return scrollingPosition < 100 ? (
        <div className="scroll-button">
            <img src="./images/scroll-down.svg" />{" "}
            <p>{i18n.t("import:scroll.down")}</p>
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
                    onClick={(e) => {
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
                <button
                    className={`btn-highlighted ${
                        isFiles() ? null : "deactivated"
                    }`}
                    onClick={
                        isFiles
                            ? () => onUpdateImportStatus(importSteps.finished)
                            : null
                    }
                >
                    {i18n.t("import:explore.button")}
                </button>
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

const Import = () => {
    const { importSteps, navigationState, updateImportStatus, addFile, files } =
        useContext(ImporterContext);
    const importStatus = navigationState.importStatus;

    const [selectedFile, selectFile] = useState(null);

    const handleImportFile = () => {
        addFile(selectedFile);
        updateImportStatus(importSteps.explore);
    };

    const isFiles = () => {
        return files.length > 0 ? true : false;
    };

    return (
        <div className="import-view">
            <ProgressBar
                onUpdateImportStatus={updateImportStatus}
                importStatus={importStatus}
            />
            <ImportExplanationExpandable
                importSteps={importSteps}
                importStatus={importStatus}
                selectedFile={selectedFile}
                selectFile={selectFile}
                onImportFile={handleImportFile}
                onUpdateImportStatus={updateImportStatus}
                isFiles={isFiles}
            />
        </div>
    );
};

export default Import;
