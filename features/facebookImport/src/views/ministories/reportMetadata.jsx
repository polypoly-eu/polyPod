import React from "react";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import ReportStory from "./reportStory.jsx";

class ReportMetadataReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.reportMetadata];
    }
    get title() {
        return "Report Metadata";
    }

    get reportData() {
        return {
            fileSize: this.analyses[analysisKeys.reportMetadata].fileSize,
            filesCount: this.analyses[analysisKeys.reportMetadata].filesCount,
            preferedLanguage:
                this.analyses[analysisKeys.reportMetadata].preferedLanguage,
            polyPodRuntime:
                this.analyses[analysisKeys.reportMetadata].polyPodRuntime,
            polyPodVersion:
                this.analyses[analysisKeys.reportMetadata].polyPodVersion,
        };
    }
    render() {
        return (
            <ul>
                <li key={1}>
                    polyPod runtime:{" "}
                    {this.analyses[analysisKeys.reportMetadata].polyPodRuntime}
                </li>
                <li key={2}>
                    polyPod version:{" "}
                    {this.analyses[analysisKeys.reportMetadata].polyPodVersion}
                </li>
                <li key={3}>
                    File size: {this.analyses[analysisKeys.reportMetadata].size}
                </li>
                <li key={4}>
                    Files count:{" "}
                    {this.analyses[analysisKeys.reportMetadata].filesCount}
                </li>
                {this.analyses[analysisKeys.reportMetadata].preferedLanguage ? (
                    <>
                        <li key={5}>Language:</li>
                        <ul>
                            <li key={6}>
                                Name:{" "}
                                {
                                    this.analyses[analysisKeys.reportMetadata]
                                        .preferedLanguage.name
                                }
                            </li>
                            <li key={7}>
                                Code:{" "}
                                {
                                    this.analyses[analysisKeys.reportMetadata]
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
