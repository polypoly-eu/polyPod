import React, { useContext, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import PolypolyDialog from "../../components/dialogs/polypolyDialog/polypolyDialog.jsx";
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

    const [showNewImportDialog, setShowNewImportDialog] = useState(false);

    if (files === null)
        return <Loading message={i18n.t("overview:loading.data")} />;

    return (
        <div className="overview">
            {Object.values(files).length ? (
                <>
                    <div className="details">
                        <h1>{files[0].name}</h1>
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
                            <button
                                className="btn secondary"
                                onClick={() => setShowNewImportDialog(true)}
                            >
                                {i18n.t("overview:new.import")}
                            </button>
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
            {showNewImportDialog ? (
                <PolypolyDialog
                    message={i18n.t("overview:new.import.dialog")}
                    backButton={{
                        text: i18n.t("overview:new.import.dialog.back"),
                        onClick: () => setShowNewImportDialog(false),
                    }}
                    proceedButton={{
                        text: i18n.t("overview:new.import.dialog.continue"),
                        onClick: () => handleRemoveFile(files[0].id),
                        route: "/import",
                        stateChange: { importStatus: importSteps.import },
                    }}
                />
            ) : null}
        </div>
    );
};

export default Overview;
