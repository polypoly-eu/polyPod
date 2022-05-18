import React from "react";
import { reports } from "../ministories/reports";

import "./details.css";

export const ReportCard = ({ report }) => {
    return (
        <>
            <div className="report-card">
                <h1>{report.title}</h1>
                <div className="list">{report.render()}</div>
            </div>
            <div className="report-card-scrolling"></div>
        </>
    );
};

const ReportDetails = ({ reportStories }) => {
    function renderReportAnalyses() {
        if (!reports || !reportStories?.active) {
            return (
                <div className="report-card">
                    <h1>No Reports Found</h1>
                </div>
            );
        }
        return (
            <div>
                {reportStories?.active &&
                    reportStories?.activeStories.map((report, index) => {
                        if (report.active)
                            return <ReportCard report={report} key={index} />;
                    })}
            </div>
        );
    }

    return (
        <div className="report-details poly-theme-light">
            {renderReportAnalyses()}
        </div>
    );
};

export default ReportDetails;
