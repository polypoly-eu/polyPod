import React, { useContext, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { FacebookContext } from "../../context/facebook-context.jsx";

import i18n from "!silly-i18n";

import "./report.css";

const ReportView = ({ reportStories }) => {
    const { setReportResult, handleBack } = useContext(FacebookContext);
    const [loading, setLoading] = useState(false);

    const handleSendReport = async () => {
        setLoading(true);
        try {
            await window.pod.endpoint.send(
                "polyPediaReport/facebook",
                JSON.stringify(reportStories.jsonReport),
                "application/json"
            );
            setReportResult(true);
        } catch (_) {
            setReportResult(false);
        }

        handleBack();
    };

    const viewDetailsLabel = i18n.t("report:viewDetails");

    return (
        <div className="report-view">
            <h1 className="report-view-title">
                {i18n.t("report:intro.headline")}
            </h1>
            <p>
                {i18n.t("report:intro.text", {
                    view_details: viewDetailsLabel,
                })}
            </p>
            <div className={"button-area" + (loading ? " disabled" : "")}>
                <RouteButton className="view-details" route="/report/details">
                    {viewDetailsLabel}
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
