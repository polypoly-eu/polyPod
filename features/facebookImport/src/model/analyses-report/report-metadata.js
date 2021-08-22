import React from "react";

export default class ReportMetadataAnalysis {
    get title() {
        return "Report Metadata";
    }

    get id() {
        return "report-metadata";
    }

    get isForDataReport() {
        return true;
    }

    get jsonReport() {
        return {
            id: this.id,
            metadata: {
                fileSize: this._size,
                filesCount: this._filesCount,
                preferedLanguage: this._preferedLanguage,
            },
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
                <li
                    key={3}
                >{`Preferred language: ${this._preferedLanguage}`}</li>
            </ul>
        );
    }
}
