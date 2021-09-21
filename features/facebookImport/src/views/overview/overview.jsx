import React, { useContext } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import Loading from "../../components/loading/loading.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./overview.css";

const Overview = () => {
    const {
        facebookAccount,
        files,
        handleRemoveFile,
        updateImportStatus,
        importSteps,
    } = useContext(ImporterContext);

    const facebookHeader = (
        <div className="header">
            <h3>Facebook</h3>
            <p>{i18n.t("overview:fb.product")}</p>
            <p className="gray">{i18n.t("overview:internet")}</p>
            <div className="separator"></div>
        </div>
    );

    if (files === null)
        return <Loading message={i18n.t("overview:loading.data")} />;

    return (
        <div className="overview">
            {facebookHeader}
            {Object.values(files).length ? (
                <>
                    <div className="details">
                        <p>Name: {files[0].name}</p>
                        <p>
                            {i18n.t("overview:imported.time")} {files[0].time}
                        </p>
                        <p>
                            {i18n.t("overview:size")} {files[0].size} bytes
                        </p>
                        <div className="separator"></div>
                    </div>

                    <div className="imported-files">
                        <h4>{i18n.t("overview:imported.files")}</h4>
                        {facebookAccount &&
                        facebookAccount.importedFileNames.length ? (
                            <div className="file-list">
                                {facebookAccount.importedFileNames.map(
                                    (entry, index) => (
                                        <div
                                            className="file-button"
                                            key={index}
                                        >
                                            {entry}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    <div className="footer">
                        <div className="overlay"></div>
                        <div className="btn-holder">
                            <RouteButton
                                className="btn primary"
                                route="/explore"
                            >
                                {i18n.t("overview:explore")}
                            </RouteButton>
                            <RouteButton
                                className="btn secondary"
                                route="/import"
                                stateChange={{
                                    importStatus: importSteps.import,
                                }}
                                onClick={() => handleRemoveFile(files[0].id)}
                            >
                                {i18n.t("overview:new.import")}
                            </RouteButton>
                        </div>
                    </div>
                </>
            ) : (
                <div className="btn-holder">
                    <RouteButton
                        route="/import"
                        className="btn primary"
                        stateChange={{
                            importStatus: importSteps.beginning,
                        }}
                        onClick={() =>
                            updateImportStatus(importSteps.beginning)
                        }
                    >
                        {i18n.t("overview:import.data")}
                    </RouteButton>
                </div>
            )}
        </div>
    );
};

export default Overview;
