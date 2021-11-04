import React from "react";
import ReportAnalysis from "./report-analysis.js";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    get title() {
        return "Importing status";
    }

    get reportData() {
        return this._importersData;
    }

    _extractDataFromStatus(status) {
        return {
            name: status.status,
            message: status.message,
        };
    }

    async analyze({ facebookAccount }) {
        this._importersData = facebookAccount.importingResults.map(
            ({ importer, status, executionTime }) => {
                return {
                    format: "v2",
                    importerName: importer.constructor.name,
                    executionTime: executionTime.toFixed(1),
                    status: Array.isArray(status)
                        ? status.map((each) =>
                              this._extractDataFromStatus(each)
                          )
                        : this._extractDataFromStatus(status),
                };
            }
        );
        //debugger;
        this.active = this._importersData.length > 0;
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
                                    <td>
                                        {(Array.isArray(status)
                                            ? status
                                            : [status]
                                        ).map((each, statusIndex) => {
                                            return (
                                                <div key={statusIndex}>
                                                    {each.name +
                                                        (each.message
                                                            ? " - " +
                                                              each.message
                                                            : "")}
                                                </div>
                                            );
                                        })}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </>
        );
    }
}
