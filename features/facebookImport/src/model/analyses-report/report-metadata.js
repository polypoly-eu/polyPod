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
        this._size = size;

        const entries = await zipFile.getEntries();
        this._filesCount = entries.length;

        this._preferedLanguage = "todo";
    }

    render() {
        return (
            <ul>
                <li key={1}>{`File size: ${this._size}`}</li>
                <li key={2}>{`Files count: ${this._filesCount}`}</li>
            </ul>
        );
    }
}
