import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./report.css";

const ReportCard = ({ analysis }) => {
    return (
        <div className="analysis-card">
            <h1>{analysis.title}</h1>
            <div className="list">{analysis.render()}</div>
        </div>
    );
};

const ReportView = () => {
    const { fileAnalysis } = useContext(ImporterContext);
    const unrecognizedData = fileAnalysis.unrecognizedData;

    //Todo
    const handleSendReport = () => {
        console.log("ToDo");
        console.log(unrecognizedData.jsonReport);
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
            <h1>Unrecognized data report</h1>
            {renderReportAnalyses()}
            <button onClick={handleSendReport}>Send report</button>
        </div>
    );
};

export default ReportView;
