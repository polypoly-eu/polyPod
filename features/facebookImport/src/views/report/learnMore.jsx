import React, { useContext, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./report.css";

const ReportLearnMore = () => {
    const { fileAnalysis, setReportResult, handleBack } =
        useContext(ImporterContext);
    const unrecognizedData = fileAnalysis.unrecognizedData;
    const [loading, setLoading] = useState(false);

    const handleSendReport = async () => {
        setLoading(true);

        const error = await window.pod.network.httpPost(
            process.env.POLYPOD_POLYPEDIA_REPORT_URL,
            JSON.stringify(unrecognizedData.jsonReport),
            "application/json",
            process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION
        );
        if (error) console.error("Failed to send report:", error);
        setReportResult(!error);
        handleBack();
    };

    return (
        <div className="report-view">
            <h1 className="learn-more-title">
                {i18n.t("report:learnMore.headline")}
            </h1>
            <p>{i18n.t("report:learnMore.text")}</p>
            <div className={"button-area" + (loading ? " disabled" : "")}>
                <RouteButton
                    className="view-details"
                    route="/report/learnmore/details"
                >
                    {i18n.t("report:viewDetails")}
                </RouteButton>
                <button className="send-later" onClick={handleBack}>
                    {i18n.t("report:sendLater")}
                </button>
                <button className="send" onClick={handleSendReport}>
                    {i18n.t("report:send")}
                </button>
            </div>
        </div>
    );
};

export default ReportLearnMore;
