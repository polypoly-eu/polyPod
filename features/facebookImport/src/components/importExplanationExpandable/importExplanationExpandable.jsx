import React, { useEffect, useRef, useContext } from "react";
import i18n from "../../i18n.js";
import RouteButton from "../buttons/routeButton.jsx";
import InfoBox from "../infoBox/infoBox.jsx";
import ScrollButton from "../buttons/scrollButton/scrollButton.jsx";
import scrollSmoothly from "../../utils/smoothScroll.js";
import { ImporterContext } from "../../context/importer-context.jsx";

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
    const { setStartRequest } = useContext(ImporterContext);

    useEffect(() => {
        scrollSmoothly(importIds[importStatus], expandableId, ["progress-bar"]);
    }, [importStatus]);

    const handleRequestStatus = () => {
        onUpdateImportStatus(importSteps.download);
        window.pod.polyNav.openUrl("https://www.facebook.com/dyi");
        setStartRequest(true);
    };

    const handleImportStatus = () => {
        onUpdateImportStatus(importSteps.explore);
        setStartRequest(true);
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
                <InfoBox textContent={i18n.t("import:request.info.1")} />
                <div className="separator"></div>
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
                <InfoBox textContent={i18n.t("import:request.info.2")} />
                <button
                    className="btn-highlighted"
                    onClick={() => handleRequestStatus()}
                >
                    {i18n.t("import:request.button")}
                </button>
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
                <InfoBox textContent={i18n.t("import:download.info")} />
                <div className="separator"></div>
                <h4>{i18n.t("import:how.it.works")}:</h4>
                <img src="./images/letter.svg" alt="facebook" />
                <p>{i18n.t("import:download.2")}</p>
                <img src="./images/download.svg" alt="document" />
                <p>{i18n.t("import:download.3")}</p>
                <button className="btn-highlighted btn-1">
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
                <div className="separator"></div>
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
                    ) : (
                        <h5>{i18n.t("import:import.none.chosen")}</h5>
                    )}
                </div>
                <InfoBox textContent={i18n.t("import:import.info")} />
                <button
                    className={"btn-secondary btn-2"}
                    onClick={async () => {
                        if (file) await onRemoveFile();
                        onImportFile();
                    }}
                >
                    {file
                        ? i18n.t("import:import.button.1.different")
                        : i18n.t("import:import.button.1")}
                </button>
                <button
                    className={`btn-highlighted ${file ? "" : "deactivated"}`}
                    onClick={file ? () => handleImportStatus() : () => {}}
                >
                    {i18n.t("import:import.button.2")}
                </button>
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
                <p className="bold">{i18n.t("import:intro.text.2")}</p>
                <InfoBox textContent={i18n.t("import:intro.info")} />
            </div>
            <ScrollButton
                scrollRef={expandableRef}
                img="./images/scroll-down.svg"
                scrollButtonText={i18n.t("import:scroll.down")}
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
