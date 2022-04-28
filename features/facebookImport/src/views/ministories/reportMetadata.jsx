import React from "react";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
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
            preferedLanguage: analysisData.preferedLanguage,
            polyPodRuntime: analysisData.polyPodRuntime,
            polyPodVersion: analysisData.polyPodVersion,
        };
    }
    render() {
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
                {this.reportData.preferedLanguage ? (
                    <>
                        <li key={5}>Language:</li>
                        <ul>
                            <li key={6}>
                                Name: {this.reportData.preferedLanguage.name}
                            </li>
                            <li key={7}>
                                Code: {this.reportData.preferedLanguage.code}
                            </li>
                        </ul>
                    </>
                ) : (
                    ""
                )}
            </ul>
        );
    }
}

export default ReportMetadataReport;
