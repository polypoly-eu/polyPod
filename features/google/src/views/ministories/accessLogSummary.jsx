import React from "react";
import analysisKeys from "../../model/analyses/analysisKeys";
import ReportStory from "./reportStory.jsx";

class AccessLogSummaryReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.accessLogSummary];
    }
    get title() {
        return "AccessLog Summary";
    }
    get reportData() {
        return this.reports[analysisKeys.accessLogSummary];
    }

    _renderSummary() {
        return (
            <ul>
                <li key={1}>File Name: {this.reportData.fileName}</li>
                <li key={2}>File Size: {this.reportData.fileSize}</li>
            </ul>
        );
    }
}

export default AccessLogSummaryReport;
