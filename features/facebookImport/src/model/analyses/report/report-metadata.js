import React from "react";
import { ReportAnalysis } from "@polypoly-eu/poly-analysis";

export default class ReportMetadataAnalysis extends ReportAnalysis {
    get title() {
        return "Report Metadata";
    }

    get reportData() {
        return {
            fileSize: this._size,
            filesCount: this._filesCount,
            preferedLanguage: this._preferedLanguage,
            polyPodRuntime: this._polyPodRuntime,
            polyPodVersion: this._polyPodVersion,
        };
    }

    async analyze({ size, zipFile, facebookAccount, pod }) {
        this.active = true;

        const info = await pod.info;
        this._polyPodRuntime = await info.getRuntime();
        this._polyPodVersion = await info.getVersion();

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
                <li key={1}>polyPod runtime: {this._polyPodRuntime}</li>
                <li key={2}>polyPod version: {this._polyPodVersion}</li>
                <li key={3}>File size: {this._size}</li>
                <li key={4}>Files count: {this._filesCount}</li>
                {this._preferedLanguage ? (
                    <>
                        <li key={5}>Language:</li>
                        <ul>
                            <li key={6}>Name: {this._preferedLanguage.name}</li>
                            <li key={7}>Code: {this._preferedLanguage.code}</li>
                        </ul>
                    </>
                ) : (
                    ""
                )}
            </ul>
        );
    }
}
