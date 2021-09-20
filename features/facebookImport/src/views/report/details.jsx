import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./report.css";

export const ReportCard = ({ analysis }) => {
    return (
        <>
            <div className="report-card">
                <h1>{analysis.title}</h1>
                <div className="list">{analysis.render()}</div>
            </div>
            <div className="report-card-scrolling"></div>
        </>
    );
};

const ReportDetails = () => {
    const { fileAnalysis } = useContext(ImporterContext);
    const unrecognizedData = fileAnalysis.unrecognizedData;

    function renderReportAnalyses() {
        if (!unrecognizedData) {
            return "";
        }
        return (
            <div>
                {unrecognizedData.reportAnalyses.map((analysis, index) => (
                    <ReportCard analysis={analysis} key={index} />
                ))}
            </div>
        );
    }

    return <div className="report-details">{renderReportAnalyses()}</div>;
};

export default ReportDetails;
