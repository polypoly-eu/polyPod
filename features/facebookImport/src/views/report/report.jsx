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
        let response;

        try {
            response = await window.pod.endpoint.send(
                "polyPediaReports",
                JSON.stringify(unrecognizedData.jsonReport),
                "application/json"
            );
        } catch (e) {}

        setReportResult(response ? true : false);
        handleBack();
    };

    return (
        <div className="report-view">
            <h1 className="report-view-title">
                {i18n.t("report:intro.headline")}
            </h1>
            <p>{i18n.t("report:intro.text")}</p>
            <div className={"button-area" + (loading ? " disabled" : "")}>
                <RouteButton className="view-details" route="/report/details">
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

export default ReportView;
