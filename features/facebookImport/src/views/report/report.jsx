import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./report.css";

const ReportCard = ({ analysis }) => {
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

const ReportView = () => {
    const { fileAnalysis } = useContext(ImporterContext);
    const unrecognizedData = fileAnalysis.unrecognizedData;

    const handleSendReport = () => {
        window.pod.network.httpPost(
            process.env.POLYPOD_POLYPEDIA_REPORT_URL,
            JSON.stringify(unrecognizedData.jsonReport),
            "application/json",
            process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION
        );
    };

    function renderReportAnalyses() {
        if (!unrecognizedData) {
            return "";
        }
        return (
            <div>
                {unrecognizedData.reportAnalyses.map((analysis, index) => (
                    <ReportCard analysis={analysis} key={index} />
                ))}
                <ReportCard
                    analysis={unrecognizedData.inactiveAnalysis}
                    key={unrecognizedData.reportAnalyses.length + 1}
                />
            </div>
        );
    }

    return (
        <div className="report-view">
            <h1 className="report-view-title">Unrecognized data report</h1>
            {renderReportAnalyses()}
            <div className="button-area">
                {/* <div className={... ? "" : "hidden-message"}>Report sent successfully.</div> */}
                <button className="send" onClick={handleSendReport}>
                    Send report
                </button>
            </div>
        </div>
    );
};

export default ReportView;
