import { PolyChart } from "@polypoly-eu/poly-look";
import React, { useContext, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import PolypolyDialog from "../../components/dialogs/polypolyDialog/polypolyDialog.jsx";
import Loading from "../../components/loading/loading.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";
import i18n from "../../i18n.js";
import { useHistory } from "react-router";

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
    const history = useHistory();

    if (facebookAccount === null || files === null)
        return (
            <Loading
                message={i18n.t("overview:loading.data")}
                loadingGif="./images/loading.gif"
            />
        );

    const bubbleVizWidth = 400;
    const bubbleVizHeight = 400;
    const dataBubblesLightColor = "#f7fafc";

    const bubbleData = facebookAccount.dataGroups.filter(
        ({ count }) => count > 0
    );

    bubbleData.forEach((d) => {
        d.value = d.count;
    });
    bubbleData.sort(function (a, b) {
        return b.value - a.value;
    });

    const getFormattedTime = (time) => {
        let t = new Date(1970, 0, 1);
        t.setUTCSeconds(+time);

        // for testing in browser, where 'time' is a real date, use instead of the above this one:
        // const t = new Date(time);

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return t.toLocaleDateString(i18n.t("overview:time.format"), options);
    };

    const formatSize = (size) => {
        const k = 1024;
        const decimals = 2;
        if (size === 1) return i18n.t("common:format.byte");
        if (size < k) return `${size} ${i18n.t("common:format.bytes")}`;
        const units = [
            i18n.t("common:format.KB"),
            i18n.t("common:format.MB"),
            i18n.t("common:format.GB"),
        ];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return Math.round(size / Math.pow(k, i), decimals) + " " + units[i - 1];
    };
    return (
        <div className="overview">
            {Object.values(files).length ? (
                <>
                    <h1 className="overview-title">
                        {i18n.t("overview:above.chart.title")}
                    </h1>

                    <p
                        dangerouslySetInnerHTML={{
                            __html: i18n.t("overview:above.chart.text", {
                                number_categories: bubbleData.length,
                            }),
                        }}
                    />
                    <PolyChart
                        type="bubble-cluster"
                        data={bubbleData}
                        width={bubbleVizWidth}
                        height={bubbleVizHeight}
                        bubbleColor={dataBubblesLightColor}
                        onBubbleClick={() => history.push("/explore")}
                        showValues={false}
                    />
                    <div className="details">
                        <p>
                            {i18n.t("overview:file")} {files[0].name}
                        </p>
                        <div className="inline-block">
                            <p>
                                {i18n.t("overview:imported.time")}{" "}
                                {getFormattedTime(files[0].time)}
                            </p>
                            <p>
                                {i18n.t("overview:size")}{" "}
                                {formatSize(files[0].size)}
                            </p>
                        </div>
                    </div>

                    <div className="footer">
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
                        onClick: async () => {
                            await handleRemoveFile(files[0].id);
                            updateImportStatus(importSteps.import);
                        },
                        route: "/import",
                        stateChange: { importStatus: importSteps.import },
                    }}
                />
            ) : null}
        </div>
    );
};

export default Overview;
