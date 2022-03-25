import React, { useContext, useEffect, useState } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";
import Loading from "../../components/loading/loading.jsx";

import ProgressBarComponent from "../../components/progressBar/progressBar.jsx";
import ImportExplanationExpandable from "../../components/importExplanationExpandable/importExplanationExpandable.jsx";

import "./import.css";
import i18n from "../../i18n.js";
import PolypolyDialog from "../../components/dialogs/polypolyDialog/polypolyDialog.jsx";

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

const namespace = "http://polypoly.coop/schema/fbImport/";

//from storage
async function readImportStatus(pod) {
    const { dataFactory } = pod;
    const statusQuads = await pod.polyIn.select({
        subject: dataFactory.namedNode(`${namespace}facebookImporter`),
        predicate: dataFactory.namedNode(`${namespace}importStatus`),
    });
    let status = statusQuads[0]?.object?.value?.split(namespace)[1];
    return status || importSteps.beginning;
}

async function writeImportStatus(pod, status) {
    const { dataFactory, polyIn } = pod;
    const existingQuad = (
        await pod.polyIn.select({
            subject: dataFactory.namedNode(`${namespace}facebookImporter`),
            predicate: dataFactory.namedNode(`${namespace}importStatus`),
        })
    )[0];
    if (existingQuad) await polyIn.delete(existingQuad);
    const quad = dataFactory.quad(
        dataFactory.namedNode(`${namespace}facebookImporter`),
        dataFactory.namedNode(`${namespace}importStatus`),
        dataFactory.namedNode(`${namespace}${status}`)
    );
    await polyIn.add(quad);
}

const Import = () => {
    const {
        pod,
        files,
        selectedFile,
        setSelectedFile,
        handleRemoveFile,
        handleSelectFile,
        handleImportFile,
    } = useContext(ImporterContext);
    const [importStatus, setImportStatus] = useState(importSteps.beginning);
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
            {files === null && (
                <div className="overlay">
                    <Loading
                        message={i18n.t("import:importing.data")}
                        loadingGif="./images/loading-black.gif"
                    />
                </div>
            )}
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
