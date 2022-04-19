import React from "react";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import Story from "../ministories/story.jsx";

class DataImportingStatusMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.importersData];
    }
    get title() {
        return "Importing status";
    }

    get reportData() {
        return this.analyses[analysisKeys.importersData];
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
                    Data was read using{" "}
                    {this.analyses[analysisKeys.importersData].length}{" "}
                    importers. This view shows the list of importers that read
                    data.
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
                        {this.analyses[analysisKeys.importersData].map(
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

export default DataImportingStatusMinistory;
