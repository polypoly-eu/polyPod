import React, { useContext, useState, useEffect, useRef } from "react";
import {
    PolyButton,
    PolyImportContext,
    RoutingWrapper,
    ScrollLabel,
    scrollSmoothly,
    InfoBox,
} from "@polypoly-eu/poly-look";
import { GoogleContext } from "../../context/google-context.jsx";
import { useHistory } from "react-router-dom";
import { FileSelectionError, FileImportError } from "@polypoly-eu/poly-import";
import "./importExplanationExpandable.css";
import i18n from "!silly-i18n";

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
}) => {
    const { pod, runWithLoadingScreen, setGlobalError } =
        useContext(GoogleContext);
    const { files, refreshFiles, handleRemoveFile } =
        useContext(PolyImportContext);

    const importIds = {
        request: "request",
        download: "download",
        import: "import",
        explore: "explore",
    };

    const history = useHistory();

    const expandableRef = useRef();
    const expandableId = "expandable";

    useEffect(() => {
        scrollSmoothly(importIds[importStatus], expandableId, ["progress-bar"]);
    }, [importStatus]);

    const handleRequestStatus = () => {
        onUpdateImportStatus(importSteps.download);
        window.pod.polyNav.openUrl("data-download");
    };

    const handleExampleDataRequest = () => {
        onUpdateImportStatus(importSteps.import);
        window.pod.polyNav.openUrl("example-data-download");
    };

    const handleDownloadDataLinkClick = () => {
        onUpdateImportStatus(importSteps.import);
        window.pod.polyNav.openUrl("data-download");
    };

    const formatSize = (size) => {
        const k = 1024;
        const decimals = 2;
        if (size === 1) return "byte";
        if (size < k) return `${size} bytes`;
        const units = ["KB", "MB", "GB"];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return Math.round(size / Math.pow(k, i), decimals) + " " + units[i - 1];
    };

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleSelectFile = async () => {
        const { polyNav } = pod;
        runWithLoadingScreen(async function () {
            try {
                setSelectedFiles([
                    ...selectedFiles,
                    await polyNav.pickFile("application/zip"),
                ]);
            } catch (error) {
                setGlobalError(new FileSelectionError(error));
            }
        });
    };

    const handleImportFile = async () => {
        if (!selectedFiles.length) return;
        const { polyOut } = pod;
        if (files?.[0]?.id) handleRemoveFile(files[0].id);
        runWithLoadingScreen(async function () {
            try {
                let destUrl;
                for (let { url } of selectedFiles)
                    destUrl = await polyOut.importArchive(url, destUrl);
                refreshFiles();
                setSelectedFiles([]);
            } catch (error) {
                setGlobalError(new FileImportError(error));
            }
        });
        onUpdateImportStatus(importSteps.explore);
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
                <div className="poly-separator"></div>
                <h4>{i18n.t("import:how.it.works")}</h4>
                <p>{i18n.t("import:request.2")}</p>
                <p>{i18n.t("import:request.3")}</p>
                <img src="./images/document.svg" alt="document" />
                <p>{i18n.t("import:request.4")}</p>
                <InfoBox textContent={i18n.t("import:request.info.2")} />
                <PolyButton
                    className="bg-red"
                    onClick={() => handleRequestStatus()}
                    label={i18n.t("import:request.button")}
                ></PolyButton>
                <PolyButton
                    type="outline"
                    onClick={() => handleExampleDataRequest()}
                    label={i18n.t("import:request.example.data")}
                ></PolyButton>
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
                <div className="poly-separator"></div>
                <h4>{i18n.t("import:how.it.works")}</h4>
                <img src="./images/letter.svg" alt="letter" />
                <p>{i18n.t("import:download.2")}</p>
                <img src="./images/download.svg" alt="document" />
                <p>{i18n.t("import:download.3")}</p>
                <PolyButton
                    className="bg-red"
                    onClick={() => handleDownloadDataLinkClick()}
                    label={i18n.t("import:download.button.1")}
                ></PolyButton>
                <PolyButton
                    type="outline"
                    onClick={() => onUpdateImportStatus(importSteps.import)}
                    label={i18n.t("import:download.button.2")}
                ></PolyButton>
            </>
        ),
        import: (
            <>
                <img
                    src="./images/import-illustration.svg"
                    alt="import-illustration"
                    className="full-screen"
                />
                <p>{i18n.t("import:import.1")}</p>
                <InfoBox textContent={i18n.t("import:import.info")} />
                <div className="poly-separator"></div>
                <div className="x-divider">
                    {files?.length ? (
                        <h5>{i18n.t("import:file.imported.successfully")}</h5>
                    ) : selectedFiles.length ? (
                        <div className="file-info">
                            <h5>{i18n.t("import:import.chosen")}</h5>
                            {selectedFiles.map((selectedFile, i) => (
                                <div key={i}>
                                    <p>
                                        {i18n.t("import:import.name")}{" "}
                                        {selectedFile.name}
                                    </p>
                                    <p>
                                        {i18n.t("import:import.size")}
                                        {formatSize(selectedFile.size)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h5>{i18n.t("import:import.none.chosen")}</h5>
                    )}
                </div>
                <PolyButton
                    type="outline"
                    onClick={handleSelectFile}
                    label={
                        selectedFiles.length
                            ? i18n.t("import:import.button.1.different")
                            : i18n.t("import:import.button.1")
                    }
                ></PolyButton>
                <PolyButton
                    className="bg-red"
                    onClick={handleImportFile}
                    label={
                        selectedFiles.length > 1
                            ? "Import Files"
                            : "Import File"
                    }
                    disabled={selectedFiles ? "" : "disabled"}
                >
                    {i18n.t("import:import.button.2")}
                </PolyButton>
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
                {files?.length > 0 ? (
                    <>
                        <p>
                            {i18n.t("import:imported.file")} {files[0]?.name}
                        </p>
                        <RoutingWrapper history={history} route="/overview">
                            <PolyButton
                                className="bg-red"
                                label={i18n.t("import:explore.button")}
                            ></PolyButton>
                        </RoutingWrapper>
                    </>
                ) : (
                    <PolyButton
                        className="bg-red"
                        label={i18n.t("import:explore.button")}
                        disabled="disabled"
                    ></PolyButton>
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
                <h1>{i18n.t("import:intro.text.1")}</h1>
                <h1>{i18n.t("import:intro.text.2")}</h1>
                <InfoBox textContent={i18n.t("import:intro.info")} />
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
                        <h2
                            className="heading"
                            dangerouslySetInnerHTML={{
                                __html: i18n.t(`import:heading.${section}`),
                            }}
                        ></h2>
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
