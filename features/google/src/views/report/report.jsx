import { RoutingWrapper } from "@polypoly-eu/poly-look";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { GoogleContext } from "../../context/google-context.jsx";

import "./report.css";

const ReportView = ({ reportStories }) => {
    const { setReportResult, handleBack } = useContext(GoogleContext);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSendReport = async () => {
        setLoading(true);
        try {
            await window.pod.endpoint.send(
                "polyPediaReports",
                JSON.stringify(reportStories.jsonReport),
                "application/json"
            );
            setReportResult(true);
        } catch (_) {
            setReportResult(false);
        }

        handleBack();
    };

    return (
        <div className="report-view poly-theme-light">
            <h1 className="report-view-title">
                {"We are interested in how your data is structured!"}
            </h1>
            <p>
                {
                    "Your data schema may contain data types that we don't know of yet. To shed more and more light on what Facebook knows about all of us, it would be awesome if you could share this schema with us. Doing so will help us make this feature better. The data is sent anonymously and in encrypted form to our servers, meaning none of your personal information is part of the data. You can click 'View data report details' below to see exactly what is being sent."
                }
            </p>
            <div className={"button-area" + (loading ? " disabled" : "")}>
                <RoutingWrapper history={history} route="/report/details">
                    <div className="view-details">
                        {"View data report details"}
                    </div>
                </RoutingWrapper>
                <button className="send-later" onClick={handleBack}>
                    {"Do not send"}
                </button>
                <button className="send" onClick={handleSendReport}>
                    {"Send and help"}
                </button>
            </div>
        </div>
    );
};
export default ReportView;
