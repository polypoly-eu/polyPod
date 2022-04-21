import { PolyAnalysisContext } from "@polypoly-eu/poly-look";
import React, { useContext } from "react";
import reports from "../ministories/reports";

import "./details.css";

export const ReportCard = ({ report }) => {
    return (
        <div>
            <div className="report-card">
                <h1>{report.title}</h1>
                <div className="list">{report.render()}</div>
            </div>
            <div className="report-card-scrolling"></div>
        </div>
    );
};

const ReportDetails = () => {
    const { reportStories } = useContext(PolyAnalysisContext);
    function renderReportAnalyses() {
        if (!reports) {
            return "";
        }
        return (
            <div>
                {reportStories?.activeStories.map((report, index) => {
                    if (report.active)
                        return <ReportCard report={report} key={index} />;
                })}
            </div>
        );
    }

    return <div className="report-details">{renderReportAnalyses()}</div>;
};

export default ReportDetails;
