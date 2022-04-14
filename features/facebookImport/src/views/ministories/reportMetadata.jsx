import Story from "./story.jsx";
import React from "react";
import analysisKeys from "../../model/analysisKeys";

class ReportMetadataMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [
            analysisKeys.fileSize,
            analysisKeys.filesCount,
            analysisKeys.preferedLanguage,
            analysisKeys.polyPodRuntime,
            analysisKeys.polyPodVersion,
        ];
    }
    get title() {
        return "Report Metadata";
    }

    get reportData() {
        return {
            fileSize: this.analyses[analysisKeys.fileSize],
            filesCount: this.analyses[analysisKeys.filesCount],
            preferedLanguage: this.analyses[analysisKeys.preferedLanguage],
            polyPodRuntime: this.analyses[analysisKeys.polyPodRuntime],
            polyPodVersion: this.analyses[analysisKeys.polyPodVersion],
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

export default ReportMetadataMinistory;
