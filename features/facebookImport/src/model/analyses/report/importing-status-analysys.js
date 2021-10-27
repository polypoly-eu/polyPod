import React from "react";
import ReportAnalysis from "./report-analysis.js";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    get title() {
        return "Importing status";
    }

    get reportData() {
        return this._importingResults.map(
            ({ status, importerClass, message }) => {
                return {
                    status,
                    importerName: importerClass.name,
                    message,
                };
            }
        );
    }

    async analyze({ facebookAccount }) {
        this._importingResults = facebookAccount.importingResults;
        this.active = this._importingResults.length > 0;
    }

    render() {
        return (
            <>
                <p>
                    Data was read using {this._importingResults.length}{" "}
                    importers. This is a technical view showing the list of
                    importers that read data.
                </p>
                <table>
                    <tbody>
                        {this._importingResults.map(
                            ({ status, importerClass, message }, index) => (
                                <tr key={index}>
                                    <td>{importerClass.name}</td>
                                    <td>{status}</td>
                                    <td>{message}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </>
        );
    }
}
