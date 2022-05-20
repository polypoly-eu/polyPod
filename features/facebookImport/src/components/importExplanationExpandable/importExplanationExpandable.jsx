import React, { useEffect, useRef } from "react";
import i18n from "!silly-i18n";
import RouteButton from "../buttons/routeButton.jsx";
import { ScrollLabel, scrollSmoothly, InfoBox } from "@polypoly-eu/poly-look";
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
    onSelectFile,
    onImportFile,
    file,
    onRemoveFile,
}) => {
    const importIds = {
        request: "request",
        download: "download",
        import: "import",
        explore: "explore",
    };

    const expandableRef = useRef();
    const expandableId = "expandable";

    useEffect(() => {
        scrollSmoothly(importIds[importStatus], expandableId, ["progress-bar"]);
    }, [importStatus]);

    const handleRequestStatus = () => {
        onUpdateImportStatus(importSteps.download);
        window.pod.polyNav.openUrl("https://www.facebook.com/dyi");
    };

    const handleExampleDataRequest = () => {
        onUpdateImportStatus(importSteps.import);
        window.pod.polyNav.openUrl("example-data-download");
    };

    const handleDownloadDataLinkClick = () => {
        onUpdateImportStatus(importSteps.import);
        window.pod.polyNav.openUrl("https://www.facebook.com/dyi");
    };

    const handleImportStatus = () => {
        onUpdateImportStatus(importSteps.explore);
    };

    const formatSize = (size) => {
        const k = 1024;
        const decimals = 2;
        if (size === 1) return i18n.t("common:format.byte");
        if (size < k) return `${size} ${i18n.t("common:format.bytes")}`;
        const units = [
            i18n.t("common:format.KB"),
            i18n.t("common:format.MB"),
            i18n.t("common:format.GB"),
        ];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return Math.round(size / Math.pow(k, i), decimals) + " " + units[i - 1];
    };

    const bodyContent = {
        request: (
            <>
                <img
                    src="./images/request-illustration.svg"
                    alt="request-illustration"
                    className="full-screen"
                />
                <p>{i18n.t("import:request.1")}</p>
                <InfoBox
                    img="./images/info-circle.svg"
                    textContent={i18n.t("import:request.info.1")}
                />
                <div className="poly-separator"></div>
                <h4>{i18n.t("import:how.it.works")}:</h4>
                <img src="./images/facebook.svg" alt="facebook" />
                <p>{i18n.t("import:request.2")}</p>
                <p>{i18n.t("import:request.3")}</p>
                <img src="./images/document.svg" alt="document" />
                <p>{i18n.t("import:request.4")}</p>
                <img
                    src="./images/import-settings.png"
                    className="full-screen"
                    alt="select-json"
                />
                <button
                    className="btn-highlighted"
                    onClick={() => handleRequestStatus()}
                >
                    {i18n.t("import:request.button")}
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => handleExampleDataRequest()}
                >
                    {i18n.t("import:request.example.data")}
                </button>
                <InfoBox
                    img="./images/info-circle.svg"
                    textContent={i18n.t("import:request.info.2")}
                />
            </>
        ),
        download: (
            <>
                <img
                    src="./images/download-illustration.svg"
                    alt="download-illustration"
                    className="full-screen"
                />
                <p>{i18n.t("import:download.1")}</p>
                <InfoBox
                    img="./images/info-circle.svg"
                    textContent={i18n.t("import:download.info")}
                />
                <div className="poly-separator"></div>
                <h4>{i18n.t("import:how.it.works")}:</h4>
                <img src="./images/letter.svg" alt="facebook" />
                <p>{i18n.t("import:download.2")}</p>
                <img src="./images/download.svg" alt="document" />
                <p>{i18n.t("import:download.3")}</p>
                <button
                    className="btn-highlighted btn-1"
                    onClick={() => handleDownloadDataLinkClick()}
                >
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
                <img
                    src="./images/import-illustration.svg"
                    alt="import-illustration"
                    className="full-screen"
                />
                <p>{i18n.t("import:import")}</p>
                <div className="poly-separator"></div>
                <div className="x-divider">
                    {file ? (
                        <div className="file-info">
                            <h5>{i18n.t("import:import.chosen")}</h5>
                            <p>
                                {i18n.t("import:import.name")} {file.name}
                            </p>
                            <p>
                                {i18n.t("import:import.size")}{" "}
                                {formatSize(file.size)}
                            </p>
                        </div>
                    ) : selectedFile ? (
                        <div className="file-info">
                            <h5>{i18n.t("import:import.chosen")}</h5>
                            <p>{selectedFile?.name}</p>
                            <p>
                                {i18n.t("import:import.size")}{" "}
                                {formatSize(selectedFile.size)}
                            </p>
                        </div>
                    ) : (
                        <h5>{i18n.t("import:import.none.chosen")}</h5>
                    )}
                </div>
                <button
                    className={"btn-secondary btn-2"}
                    onClick={async () => {
                        if (file) await onRemoveFile();
                        onSelectFile();
                    }}
                >
                    {file || selectedFile
                        ? i18n.t("import:import.button.1.different")
                        : i18n.t("import:import.button.1")}
                </button>
                <button
                    className={`btn-highlighted ${
                        selectedFile ? "" : "deactivated"
                    }`}
                    onClick={
                        selectedFile
                            ? async () => {
                                  await onImportFile();
                                  handleImportStatus();
                              }
                            : () => {}
                    }
                >
                    {i18n.t("import:import.button.2")}
                </button>
                <InfoBox
                    img="./images/info-circle.svg"
                    textContent={i18n.t("import:import.info")}
                />
            </>
        ),
        explore: (
            <>
                <img
                    src="./images/explore-illustration.svg"
                    alt="explore-illustration"
                    className="full-screen"
                />
                <p>{i18n.t("import:explore.1")}</p>
                {file ? (
                    <RouteButton className="btn-highlighted" route="/">
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
            id={expandableId}
            className="explanation-expandable"
        >
            <div className="intro">
                <p>{i18n.t("import:intro.text.1")}</p>
                <p>{i18n.t("import:intro.text.2")}</p>
                <InfoBox
                    img="./images/info-circle.svg"
                    textContent={i18n.t("import:intro.info")}
                />
            </div>
            <ScrollLabel
                scrollRef={expandableRef}
                img="./images/scroll-down.svg"
                scrollLabelText={i18n.t("import:scroll.down")}
            />
            {Object.values(importSections).map((section, index) => (
                <div key={index} className={`section ${section}`}>
                    <div
                        onClick={() => onUpdateImportStatus(section)}
                        className="head"
                        id={importIds[section]}
                    >
                        <div className={`number ${section}`}>{index + 1}</div>
                        <div
                            className="heading"
                            dangerouslySetInnerHTML={{
                                __html: i18n.t(`import:heading.${section}`),
                            }}
                        />
                        <img
                            src="./images/angle-up.svg"
                            alt="arrow-up"
                            className={
                                isSectionOpened(
                                    section,
                                    importStatus,
                                    importSteps
                                )
                                    ? ""
                                    : "rotate-180"
                            }
                        />
                    </div>
                    {isSectionOpened(section, importStatus, importSteps) ? (
                        <div className="section-body">
                            {bodyContent[section]}
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default ImportExplanationExpandable;
