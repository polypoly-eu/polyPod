import { RoutingWrapper } from "@polypoly-eu/poly-look";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { GoogleContext } from "../../context/google-context.jsx";
import i18n from "!silly-i18n";

import "./report.css";

const ReportView = ({ reportStories }) => {
    const { handleBack, handleReportSent } = useContext(GoogleContext);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSendReport = async () => {
        setLoading(true);
        try {
            await window.pod.endpoint.send(
                "polyPediaReport",
                JSON.stringify(reportStories.jsonReport),
                "application/json"
            );
            handleReportSent(true);
        } catch (_) {
            handleReportSent(false);
        }
        handleBack();
    };

    return (
        <div className="report-view poly-theme-light">
            <h1 className="report-view-title">
                {i18n.t("report:intro.headline")}
            </h1>
            <p>{i18n.t("report:intro.text")}</p>
            <div className={"button-area" + (loading ? " disabled" : "")}>
                <RoutingWrapper history={history} route="/report/details">
                    <div className="view-details">
                        {i18n.t("report:view.details")}
                    </div>
                </RoutingWrapper>
                <button className="send-later" onClick={handleBack}>
                    {i18n.t("report:send.later")}
                </button>
                <button className="send" onClick={handleSendReport}>
                    {i18n.t("report:send")}
                </button>
            </div>
        </div>
    );
};
export default ReportView;
