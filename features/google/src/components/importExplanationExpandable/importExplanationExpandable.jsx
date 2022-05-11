import React, { useContext, useState } from "react";
// import InfoBox from "../infoBox/infoBox.jsx";
import {
    PolyButton,
    PolyImportContext,
    RoutingWrapper,
} from "@polypoly-eu/poly-look";
import { GoogleContext } from "../../context/google-context.jsx";
import { useHistory } from "react-router-dom";
import { FileSelectionError, FileImportError } from "@polypoly-eu/poly-import";
// import ScrollButton from "../buttons/scrollButton/scrollButton.jsx";
// import scrollSmoothly from "../../utils/smoothScroll.js";
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

    // const expandableRef = useRef();
    const expandableId = "expandable";

    // useEffect(() => {
    //     scrollSmoothly(importIds[importStatus], expandableId, ["progress-bar"]);
    // }, [importStatus]);

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

    const formatSize = (size) => {
        const k = 1024;
        const decimals = 2;
        if (size === 1) return "byte";
        if (size < k) return `${size} bytes`;
        const units = ["KB", "MB", "GB"];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return Math.round(size / Math.pow(k, i), decimals) + " " + units[i - 1];
    };

    const [selectedFile, setSelectedFile] = useState(null);

    const handleSelectFile = async () => {
        const { polyNav } = pod;
        runWithLoadingScreen(async function () {
            try {
                setSelectedFile(await polyNav.pickFile("application/zip"));
            } catch (error) {
                setGlobalError(new FileSelectionError(error));
            }
        });
    };

    const handleImportFile = async () => {
        if (!selectedFile) return;
        const { polyOut } = pod;
        if (files?.[0]?.id) handleRemoveFile(files[0].id);
        runWithLoadingScreen(async function () {
            try {
                await polyOut.importArchive(selectedFile.url);
                refreshFiles();
                setSelectedFile(null);
            } catch (error) {
                setGlobalError(new FileImportError(error));
            }
        });
    };

    //  const onRemoveFile = () => {
    //     return handleRemoveFile(file.id);
    // };

    const bodyContent = {
        request: (
            <>
                <img
                    src="./images/request-illustration.svg"
                    alt="request-illustration"
                    className="full-screen"
                />
                <p>
                    To import your data to your polyPod you need to request it
                    from Facebook first.
                </p>
                {/* <InfoBox textContent={i18n.t("import:request.info.1")} /> */}
                <div className="separator"></div>
                <h4>How it works:</h4>
                <img src="./images/facebook.svg" alt="facebook" />
                <p>Go to facebook.com/dyi.</p>
                <p>
                    The browser will then ask you whether you want to continue
                    with the browser version or to use your mobile app in case
                    you have it installed. Select to continue with the browser.
                </p>
                <img src="./images/document.svg" alt="document" />
                <p>
                    On the Facebook page scroll down and change the file format
                    to JSON and the media quality to Low, then request the file.
                    Also make sure you select All Time to get all of your data.
                    You will get an email confirmation of your request.,
                </p>
                <img
                    src="./images/import-settings.png"
                    className="full-screen"
                    alt="select-json"
                />
                <button
                    className="btn-highlighted"
                    onClick={() => handleRequestStatus()}
                >
                    Make your request
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => handleExampleDataRequest()}
                >
                    Use example data
                </button>
                {/* <InfoBox textContent={i18n.t("import:request.info.2")} /> */}
            </>
        ),
        download: (
            <>
                <img
                    src="./images/download-illustration.svg"
                    alt="download-illustration"
                    className="full-screen"
                />
                <p>
                    After you have requested your data, Facebook will notify you
                    when you can download it to your phone.
                </p>
                {/* <InfoBox textContent={i18n.t("import:download.info")} /> */}
                <div className="separator"></div>
                <h4>How it works:</h4>
                <img src="./images/letter.svg" alt="facebook" />
                <p>
                    Once your data is available you will receive an email from
                    Facebook. Click on the download link in the email.
                </p>
                <img src="./images/download.svg" alt="document" />
                <p>
                    In the Available Copies section of the Facebook page you can
                    download the file. The file will be saved to your phone.
                </p>
                <button
                    className="btn-highlighted btn-1"
                    onClick={() => handleDownloadDataLinkClick()}
                >
                    Download your data
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => onUpdateImportStatus(importSteps.import)}
                >
                    Already downloaded your data?
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
                <p>
                    After you have downloaded your data file onto your phone you
                    can import it into your polyPod.
                </p>
                <div className="separator"></div>
                <div className="x-divider">
                    {files ? (
                        <div className="file-info">
                            <h5>Name:</h5>
                            {/* <p>Name: {file.name}</p> */}
                            <p>
                                Size:
                                {/* {formatSize(file.size)} */}
                            </p>
                        </div>
                    ) : selectedFile ? (
                        <div className="file-info">
                            <h5>Selected file:</h5>
                            <p>{selectedFile?.name}</p>
                            <p>
                                Size:
                                {formatSize(selectedFile.size)}
                            </p>
                        </div>
                    ) : (
                        <h5>No file selected</h5>
                    )}
                </div>
                <PolyButton
                    className="btn primary"
                    onClick={handleSelectFile}
                    label="Select File"
                ></PolyButton>
                {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                <PolyButton
                    className="btn secondary"
                    onClick={handleImportFile}
                    label="Import File"
                >
                    Import File
                </PolyButton>
                {/* <InfoBox textContent={i18n.t("import:import.info")} /> */}
            </>
        ),
        explore: (
            <>
                <img
                    src="./images/explore-illustration.svg"
                    alt="explore-illustration"
                    className="full-screen"
                />
                <p>
                    After you have imported your Facebook data to your polyPod
                    you can explore it and see what Facebook really knows about
                    you. If you want to be extra cautious with the data on your
                    phone, you can safely delete the downloaded zip archive
                    now.,
                </p>
                {files ? (
                    <>
                        {/* <p>Imported File: {files[0].name}</p> */}
                        <RoutingWrapper history={history} route="/overview">
                            <PolyButton label="Start exploring"></PolyButton>
                        </RoutingWrapper>
                    </>
                ) : (
                    <button className="btn-highlighted deactivated">
                        Start exploring
                    </button>
                )}
            </>
        ),
    };

    return (
        <div
            // ref={expandableRef}
            id={expandableId}
            className="explanation-expandable"
        >
            <div className="intro">
                <p>Find out what Facebook knows about you!</p>
                <p>How to add your Facebook data to your polyPod</p>
                {/* <InfoBox textContent={i18n.t("import:intro.info")} /> */}
            </div>
            {/* <ScrollButton
                scrollRef={expandableRef}
                img="./images/scroll-down.svg"
                scrollButtonText={i18n.t("import:scroll.down")}
            /> */}
            {Object.values(importSections).map((section, index) => (
                <div key={index} className={`section ${section}`}>
                    <div
                        onClick={() => onUpdateImportStatus(section)}
                        className="head"
                        id={importIds[section]}
                    >
                        <div className={`number ${section}`}>{index + 1}</div>
                        {/* <div
                            className="heading"
                            dangerouslySetInnerHTML={{
                                __html: i18n.t(`import:heading.${section}`),
                            }}
                        /> */}
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
