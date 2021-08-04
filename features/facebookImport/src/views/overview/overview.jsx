import React, { useContext } from "react";
import RouteButton from "../../components/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

const Overview = () => {
    const { files, handleRemoveFile } = useContext(ImporterContext);

    const fileList = (
        <>
            <h2>Imported files</h2>
            <ul>
                {Object.values(files).map((file) => (
                    <li>
                        <span>
                            ID: {file.id}. Imported: {file.time}. Size:
                            {file.data.length} bytes
                        </span>
                        <button click={() => handleRemoveFile(file.id)}>
                            Remove
                        </button>
                        <button>Explore</button>
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <div className="overview">
            <h1>File overview</h1>
            <RouteButton route="/import">Import (another) file</RouteButton>
            {Object.values(files).length ? (
                { fileList }
            ) : (
                <em>No files imported</em>
            )}
        </div>
    );
};

export default Overview;
