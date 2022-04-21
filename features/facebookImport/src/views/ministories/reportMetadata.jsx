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
        return {
            fileSize: this.reports[analysisKeys.reportMetadata].fileSize,
            filesCount: this.reports[analysisKeys.reportMetadata].filesCount,
            preferedLanguage:
                this.reports[analysisKeys.reportMetadata].preferedLanguage,
            polyPodRuntime:
                this.reports[analysisKeys.reportMetadata].polyPodRuntime,
            polyPodVersion:
                this.reports[analysisKeys.reportMetadata].polyPodVersion,
        };
    }
    render() {
        return (
            <ul>
                <li key={1}>
                    polyPod runtime:{" "}
                    {this.reports[analysisKeys.reportMetadata].polyPodRuntime}
                </li>
                <li key={2}>
                    polyPod version:{" "}
                    {this.reports[analysisKeys.reportMetadata].polyPodVersion}
                </li>
                <li key={3}>
                    File size: {this.reports[analysisKeys.reportMetadata].size}
                </li>
                <li key={4}>
                    Files count:{" "}
                    {this.reports[analysisKeys.reportMetadata].filesCount}
                </li>
                {this.reports[analysisKeys.reportMetadata].preferedLanguage ? (
                    <>
                        <li key={5}>Language:</li>
                        <ul>
                            <li key={6}>
                                Name:{" "}
                                {
                                    this.reports[analysisKeys.reportMetadata]
                                        .preferedLanguage.name
                                }
                            </li>
                            <li key={7}>
                                Code:{" "}
                                {
                                    this.reports[analysisKeys.reportMetadata]
                                        .preferedLanguage.code
                                }
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
