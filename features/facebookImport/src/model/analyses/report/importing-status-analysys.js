import React from "react";
import ReportAnalysis from "./report-analysis.js";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    get title() {
        return "Importing status";
    }

    get reportData() {
        return this._importersData;
    }

    async analyze({ facebookAccount }) {
        this._importersData = facebookAccount.importingResults.map(
            (importerResult) => importerResult.reportJsonData
        );
        this.active = this._importersData.length > 0;
    }

    _renderStatus(status) {
        return (Array.isArray(status) ? status : [status]).map(
            (each, statusIndex) => {
                return (
                    <div key={statusIndex}>
                        {each.name + (each.message ? " - " + each.message : "")}
                    </div>
                );
            }
        );
    }

    render() {
        return (
            <>
                <p>
                    Data was read using {this._importersData.length} importers.
                    This is a technical view showing the list of importers that
                    read data.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Importer</th>
                            <th>Execution Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._importersData.map(
                            (
                                { importerName, executionTime, status },
                                index
                            ) => (
                                <tr key={index}>
                                    <td>{importerName}</td>
                                    <td>{executionTime}</td>
                                    <td>{this._renderStatus(status)}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </>
        );
    }
}
