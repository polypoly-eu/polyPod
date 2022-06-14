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
            isExampleFile: analysisData.isExampleFile,
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
                <li key={4}>File count: {this.reportData.filesCount}</li>
                <li key={5}>
                    Is the imported file an example?:{" "}
                    {this.reportData.isExampleFile ? "Yes" : "No"}
                </li>
            </ul>
        );
    }
}

export default ReportMetadataReport;
