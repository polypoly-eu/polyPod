import React from "react";
import ReportAnalysis from "./report-analysis";

export default class ReportMetadataAnalysis extends ReportAnalysis {
    get title() {
        return "Report Metadata";
    }

    get reportData() {
        return {
            fileSize: this._size,
            filesCount: this._filesCount,
            preferedLanguage: this._preferedLanguage,
        };
    }

    async analyze({ size, zipFile }) {
        this.active = true;

        const info = await window.pod.info;
        this._polyPodRuntime = await info.getRuntime();
        this._polyPodVersion = await info.getVersion();

        this._size = size;

        const entries = await zipFile.getEntries();
        this._filesCount = entries.length;

        this._preferedLanguage = "todo";
    }

    render() {
        return (
            <ul>
                <li key={1}>polyPod runtime: {this._polyPodRuntime}</li>
                <li key={2}>polyPod version: {this._polyPodVersion}</li>
                <li key={3}>{`File size: ${this._size}`}</li>
                <li key={4}>{`Files count: ${this._filesCount}`}</li>
            </ul>
        );
    }
}
