import React, { useContext, useEffect, useState } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";
import {
    PolyImportContext,
    FileSelectionError,
    FileImportError,
} from "@polypoly-eu/poly-import";
import ProgressBarComponent from "../../components/progressBar/progressBar.jsx";
import ImportExplanationExpandable from "../../components/importExplanationExpandable/importExplanationExpandable.jsx";
import i18n from "../../i18n.js";
import PolypolyDialog from "../../components/dialogs/polypolyDialog/polypolyDialog.jsx";
import { FBIMPORT_NAMESPACE } from "../../constants.js";

import "./import.css";

//These are just the sections that are shown as a visual part of the import
//importSteps are all steps like loading and finished that have logical relevance for the process
const importSections = ["request", "download", "import", "explore"];

const importSteps = {
    beginning: "beginning",
    request: "request",
    download: "download",
    import: "import",
    explore: "explore",
};

const maxFileSizeSupported = {
    value: 2000000000,
    text: "2 GB",
};

//from storage
async function readImportStatus(pod) {
    const { dataFactory } = pod;
    const statusQuads = await pod.polyIn.select({
        subject: dataFactory.namedNode(`${FBIMPORT_NAMESPACE}facebookImporter`),
        predicate: dataFactory.namedNode(`${FBIMPORT_NAMESPACE}importStatus`),
    });
    let status = statusQuads[0]?.object?.value?.split(FBIMPORT_NAMESPACE)[1];
    return status || importSteps.beginning;
}

async function writeImportStatus(pod, status) {
    const { dataFactory, polyIn } = pod;
    const existingQuad = (
        await pod.polyIn.select({
            subject: dataFactory.namedNode(
                `${FBIMPORT_NAMESPACE}facebookImporter`
            ),
            predicate: dataFactory.namedNode(
                `${FBIMPORT_NAMESPACE}importStatus`
            ),
        })
    )[0];
    if (existingQuad) await polyIn.delete(existingQuad);
    const quad = dataFactory.quad(
        dataFactory.namedNode(`${FBIMPORT_NAMESPACE}facebookImporter`),
        dataFactory.namedNode(`${FBIMPORT_NAMESPACE}importStatus`),
        dataFactory.namedNode(`${FBIMPORT_NAMESPACE}${status}`)
    );
    await polyIn.add(quad);
}

const Import = () => {
    const { pod, setGlobalError, runWithLoadingScreen } =
        useContext(ImporterContext);
    const { files, handleRemoveFile, refreshFiles } =
        useContext(PolyImportContext);
    const [importStatus, setImportStatus] = useState(importSteps.beginning);
    const [selectedFile, setSelectedFile] = useState(null);
    const file = files?.[0];

    function updateImportStatus(status) {
        setImportStatus(status);
        writeImportStatus(
            pod,
            status == importSteps.explore ? importSteps.import : status
        );
    }

    const onRemoveFile = () => {
        return handleRemoveFile(file.id);
    };

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

    useEffect(() => {
        if (!pod) return;
        readImportStatus(pod).then((newImportStatus) => {
            setImportStatus(newImportStatus);
        });
    }, [pod]);

    return (
        <div className="import-view">
            <ProgressBarComponent
                onUpdateImportStatus={updateImportStatus}
                importStatus={importStatus}
                importSections={importSections}
                file={file}
            />
            <ImportExplanationExpandable
                importSteps={importSteps}
                importSections={importSections}
                importStatus={importStatus}
                selectedFile={selectedFile}
                onSelectFile={handleSelectFile}
                onImportFile={handleImportFile}
                onUpdateImportStatus={updateImportStatus}
                file={file}
                onRemoveFile={onRemoveFile}
            />
            {selectedFile?.size > maxFileSizeSupported.value ? (
                <PolypolyDialog
                    title={i18n.t("import:file.too.big.dialog.title")}
                    message={i18n.t("import:file.too.big.dialog.message", {
                        max_file_size: maxFileSizeSupported.text,
                    })}
                    proceedButton={{
                        text: "OK",
                        onClick: () => setSelectedFile(null),
                    }}
                />
            ) : null}
        </div>
    );
};

export default Import;
