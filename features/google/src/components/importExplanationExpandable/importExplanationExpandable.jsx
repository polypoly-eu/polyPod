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
        onUpdateImportStatus(importSteps.explore);
    };

    const bodyContent = {
        request: (
            <>
                <p>
                    To import your data to your polyPod you need to request it
                    from Google first.
                </p>
                <InfoBox textContent="You will need to have your login details to hand." />
                <div className="poly-separator"></div>
                <h4>How it works:</h4>
                <p>Go to https://takeout.google.com/</p>
                <p>
                    The browser will then ask you whether you want to continue
                    with the browser version or to use your mobile app in case
                    you have it installed. Select to continue with the browser.
                </p>
                <img src="./images/document.svg" alt="document" />
                <PolyButton
                    className="bg-red"
                    onClick={() => handleRequestStatus()}
                    label="Make your request"
                ></PolyButton>
                <PolyButton
                    type="outline"
                    onClick={() => handleExampleDataRequest()}
                    label="Use example data"
                ></PolyButton>
                <InfoBox textContent="IMPORTANT: Now you need to wait for the email notification from Google that your data is available for download, which can take up to 24 hours." />
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
                    After you have requested your data, Google will notify you
                    when you can download it to your phone.
                </p>
                <InfoBox textContent="It can take up to 24 hours before your data is available!" />
                <div className="poly-separator"></div>
                <h4>How it works:</h4>
                <img src="./images/letter.svg" alt="letter" />
                <p>
                    Once your data is available you will receive an email from
                    Google. Click on the download link in the email.
                </p>
                <img src="./images/download.svg" alt="document" />
                <p>
                    In the Available Copies section of the Google page you can
                    download the file. The file will be saved to your phone.
                </p>
                <PolyButton
                    className="bg-red"
                    onClick={() => handleDownloadDataLinkClick()}
                    label="Download your data"
                ></PolyButton>
                <PolyButton
                    type="outline"
                    onClick={() => onUpdateImportStatus(importSteps.import)}
                    label="Already downloaded your data?"
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
                <p>
                    After you have downloaded your data file onto your phone you
                    can import it into your polyPod.
                </p>
                <div className="poly-separator"></div>
                <div className="x-divider">
                    {files?.length ? (
                        <div className="file-info">
                            <h5>Selected file:</h5>
                            <p>Name: {files[0]?.name}</p>
                            <p>
                                Size:
                                {formatSize(files[0]?.size)}
                            </p>
                        </div>
                    ) : selectedFile ? (
                        <div className="file-info">
                            <h5>Selected file:</h5>
                            <p>Name: {selectedFile?.name}</p>
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
                    type="outline"
                    onClick={handleSelectFile}
                    label={
                        selectedFile ? "Select different File" : "Select File"
                    }
                ></PolyButton>
                <PolyButton
                    className="bg-red"
                    onClick={handleImportFile}
                    label="Import File"
                    disabled={selectedFile ? "" : "disabled"}
                >
                    Import File
                </PolyButton>
                <InfoBox textContent="The file you import includes all your Google data up to now. To update your data in the future, just request a new download." />
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
                    After you have imported your Google data to your polyPod you
                    can explore it and see what Google really knows about you.
                    If you want to be extra cautious with the data on your
                    phone, you can safely delete the downloaded zip archive now.
                </p>
                {files?.length > 0 ? (
                    <>
                        <p>Imported File: {files[0]?.name}</p>
                        <RoutingWrapper history={history} route="/overview">
                            <PolyButton
                                className="bg-red"
                                label="Start exploring"
                            ></PolyButton>
                        </RoutingWrapper>
                    </>
                ) : (
                    <PolyButton
                        className="bg-red"
                        label="Start exploring"
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
                <h1>Find out what Google knows about you!</h1>
                <h1>How to add your Google data to your polyPod</h1>
                <InfoBox textContent="Only a copy of your data is created, your Google account remains unchanged." />
            </div>
            <ScrollLabel
                scrollRef={expandableRef}
                img="./images/scroll-down.svg"
                scrollLabelText="Scroll down"
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
