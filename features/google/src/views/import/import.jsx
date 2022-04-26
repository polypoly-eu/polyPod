import React, { useContext, useState } from "react";
import { PolyImportContext } from "@polypoly-eu/poly-look";
import { GoogleContext } from "../../context/google-context.jsx";
import { useHistory } from "react-router-dom";

const ImportView = () => {
    const { files, refreshFiles, handleRemoveFile } =
        useContext(PolyImportContext);
    const { runWithLoadingScreen } = useContext(GoogleContext);
    const [selectedFile, setSelectedFile] = useState(null);

    const history = useHistory();

    const handleSelectFile = async () => {
        const { polyNav } = pod;
        if (files?.[0]?.id) handleRemoveFile(files[0].id);
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

    return (
        <div className="import-view">
            <button
                className="btn secondary"
                onClick={() => handleSelectFile()}
            >
                Select File
            </button>
            <button
                className="btn secondary"
                onClick={() => handleImportFile()}
            >
                Import File
            </button>
            <button
                onClick={() => {
                    files.length > 0 ? history.push("/") : null;
                }}
            >
                Explore
            </button>
        </div>
    );
};

export default ImportView;
