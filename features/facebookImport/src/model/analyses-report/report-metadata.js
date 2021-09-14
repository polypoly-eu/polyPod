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

    async analyze({ size, zipFile, facebookAccount }) {
        this.active = true;
        this._size = size;

        const entries = await zipFile.getEntries();
        this._filesCount = entries.length;

        this._preferedLanguage = facebookAccount.preferredLanguage
            ? {
                  name: facebookAccount.preferredLanguage.name,
                  code: facebookAccount.preferredLanguage.code,
              }
            : null;
    }

    render() {
        return (
            <ul>
                <li key={1}>{`File size: ${this._size}`}</li>
                <li key={2}>{`Files count: ${this._filesCount}`}</li>
                {this._preferedLanguage ? (
                    <>
                        <li key={3}>{`Language:`}</li>
                        <ul>
                            <li
                                key={4}
                            >{`Name: ${this._preferedLanguage.name}`}</li>
                            <li
                                key={6}
                            >{`Code: ${this._preferedLanguage.code}`}</li>
                        </ul>
                    </>
                ) : (
                    ""
                )}
            </ul>
        );
    }
}
