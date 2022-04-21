import { PolyImportContext } from "@polypoly-eu/poly-look";
import React, { useContext } from "react";
import reports from "../ministories/reports";

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

const ReportDetails = () => {
    const { account } = useContext(PolyImportContext);
    const unrecognizedData = account.unrecognizedData;

    function renderReportAnalyses() {
        if (!unrecognizedData) {
            return "";
        }
        return (
            <div>
                {reports.forEach((reportClass, index) => {
                    const report = new reportClass(unrecognizedData);
                    if (report.active)
                        return <ReportCard report={report} key={index} />;
                })}
            </div>
        );
    }

    return <div className="report-details">{renderReportAnalyses()}</div>;
};

export default ReportDetails;
