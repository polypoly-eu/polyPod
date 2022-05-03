import React, { useContext, useState } from "react";
import { PolyButton, PolyImportContext, Screen } from "@polypoly-eu/poly-look";
import { GoogleContext } from "../../context/google-context.jsx";
import { useHistory } from "react-router-dom";
import { FileSelectionError, FileImportError } from "@polypoly-eu/poly-import";

const ImportView = () => {
    const { pod, runWithLoadingScreen, setGlobalError } =
        useContext(GoogleContext);
    const { files, refreshFiles, handleRemoveFile } =
        useContext(PolyImportContext);

    const [selectedFile, setSelectedFile] = useState(null);

    const history = useHistory();

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

    return (
        <Screen className="import" layout="standard-layout">
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
            {files && files?.[0] && <p>Imported File: {files[0].name}</p>}
            <PolyButton
                onClick={() => {
                    files.length > 0 ? history.push("/") : null;
                }}
                label="Explore"
            ></PolyButton>
        </Screen>
    );
};

export default ImportView;
