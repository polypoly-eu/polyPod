import React from "react";
import analysisKeys from "../../model/analyses/analysisKeys";
import ReportStory from "./reportStory.jsx";

class ReportMetadataReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.reportMetadata];
    }
    get title() {
        return "Report Metadata";
    }

    get reportData() {
        const analysisData = this.reports[analysisKeys.reportMetadata];
        return {
            fileSize: analysisData.fileSize,
            filesCount: analysisData.filesCount,
            polyPodRuntime: analysisData.polyPodRuntime,
            polyPodVersion: analysisData.polyPodVersion,
        };
    }

    _renderSummary() {
        return (
            <ul>
                <li key={1}>
                    polyPod runtime: {this.reportData.polyPodRuntime}
                </li>
                <li key={2}>
                    polyPod version: {this.reportData.polyPodVersion}
                </li>
                <li key={3}>File size: {this.reportData.fileSize}</li>
                <li key={4}>Files count: {this.reportData.filesCount}</li>
            </ul>
        );
    }
}

export default ReportMetadataReport;
