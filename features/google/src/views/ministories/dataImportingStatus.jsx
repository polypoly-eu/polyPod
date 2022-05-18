import React from "react";
import ReportStory from "./reportStory.jsx";

class DataImportingStatusReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = ["importersData"];
    }

    get title() {
        return "Importing status";
    }

    get reportData() {
        return this.reports.importersData;
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

    _renderSummary() {
        return (
            <>
                <p>
                    Data was read using {this.reportData.length} importers. This
                    view shows the list of importers that read data.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Importer</th>
                            <th>Status</th>
                            <th>Execution Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.reportData.map(
                            (
                                { importerName, executionTime, status },
                                index
                            ) => (
                                <tr key={index}>
                                    <td>{importerName}</td>
                                    <td>{this._renderStatus(status)}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {executionTime}
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

export default DataImportingStatusReport;
