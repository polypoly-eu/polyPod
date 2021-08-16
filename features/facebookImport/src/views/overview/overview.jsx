import React, { useContext } from "react";
import RouteButton from "../../components/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./overview.css";

const Overview = () => {
    const { files, handleRemoveFile, updateImportStatus, importSteps } =
        useContext(ImporterContext);

    const facebookHeader = (
        <div className="header">
            <h3>Facebook</h3>
            <p>{i18n.t("overview:fb.product")}</p>
            <p className="gray">{i18n.t("overview:internet")}</p>
            <div className="separator"></div>
        </div>
    );

    const fileList = (
        <>
            <h4>{i18n.t("overview:imported.data")}</h4>
            {Object.values(files).map((file, index) => (
                <div className="files" key={index}>
                    <p>ID: {file.id}</p>
                    <p>
                        {i18n.t("overview:imported.time")} {file.time}
                    </p>
                    <p>
                        {i18n.t("overview:size")} {file.size} bytes
                    </p>
                    <div className="btn-holder">
                        <RouteButton className="btn primary" route="/explore">
                            {i18n.t("overview:explore")}
                        </RouteButton>
                        <RouteButton
                            className="btn secondary"
                            route="/import"
                            stateChange={{
                                importStatus: importSteps.import,
                            }}
                            onClick={() => handleRemoveFile(file.id)}
                        >
                            {i18n.t("overview:new.import")}
                        </RouteButton>
                    </div>
                </div>
            ))}
        </>
    );

    return (
        <div className="overview">
            {facebookHeader}
            {Object.values(files).length ? (
                fileList
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
