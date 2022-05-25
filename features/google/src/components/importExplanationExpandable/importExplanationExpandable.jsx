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
                    In order to analyse your data correctly you need to modify
                    the default option by tapping in the deselect all button.
                    Now we need you to select a maximum of 3 services where you
                    created data for, such as PROFILE, ACCESS LOG ACTIVITY, MY
                    ACTIVITY or LOCATION HISTORY.
                </p>
                <img src="./images/document.svg" alt="document" />
                <p>
                    For MY ACTIVITY or PROFILE is important that you change the
                    format from HTML (default) to JSON by tapping in the format
                    button and accessing the drop down options. Then request the
                    file. You will get an email confirmation of your request.
                </p>
                <InfoBox textContent="IMPORTANT: by making the request in a different format as described could result in your pod not being able to read your data and provide meaningful information. Your request will be available for downloading for up to 7 days." />
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
                    Once your data is available you will receive an email by
                    Google. Since the export might be too big for a single file,
                    you probably will have to download multiple packages.
                </p>
                <img src="./images/download.svg" alt="document" />
                <p>
                    In the &apos;Manage your exports&apos; section of the
                    takeout page you can download the files. All of them will be
                    saved to your phone in .zip format
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
                <InfoBox textContent="Please be sure to import all the packages you originally downloaded" />
                <div className="poly-separato"></div>
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
