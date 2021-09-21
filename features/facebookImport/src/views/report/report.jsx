import React, { useContext, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./report.css";

const ReportView = () => {
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
            <h1 className="report-view-title">
                {i18n.t("report:intro.headline")}
            </h1>
            <p>{i18n.t("report:intro.text")}</p>
            <h1 className="report-view-title">
                {i18n.t("report:explanation.headline")}
            </h1>
            <p>{i18n.t("report:explanation.text")}</p>
            <div className={"button-area" + (loading ? " disabled" : "")}>
                <RouteButton className="view-details" route="/report/details">
                    {i18n.t("report:explanation.viewDetails")}
                </RouteButton>
                <RouteButton className="send-later" route="/explore">
                    {i18n.t("report:explanation.sendLater")}
                </RouteButton>
                <button className="send" onClick={handleSendReport}>
                    {i18n.t("report:explanation.send")}
                </button>
            </div>
        </div>
    );
};

export default ReportView;
