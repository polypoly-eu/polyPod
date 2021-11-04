import React from "react";

/**
 * I am a "fake" analysis that shows the status of running analyses.
 * I do not have an analyse method as I get the data directly in the constructor.
 *
 * I provide the same API as an analysis that should be included in a report.
 *
 * @class
 */
export default class MinistoriesStatusAnalysis {
    constructor(analysesResults) {
        this._analysesData = analysesResults.map(
            ({ analysis, status, executionTime }) => {
                return {
                    analysis: status.analysisClass.name,
                    activationStatus: analysis.active ? "ACTIVE" : "INACTIVE",
                    executionStatus: status.name,
                    message: status.message,
                    executionTime,
                };
            }
        );
        this.active = this._analysesData.length > 0;
    }

    get title() {
        return "Mini-stories status";
    }

    get id() {
        return this.constructor.name;
    }

    get jsonReport() {
        return {
            id: this.id,
            data: this._analysesData,
        };
    }

    render() {
        return (
            <>
                <p>
                    Status of all current ministories. This is a technical view
                    giving details about the execution of ministories.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Ministory</th>
                            <th>Execution Status</th>
                            <th>Activation Status</th>
                            <th>Message</th>
                            <th>Execution Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._analysesData.map(
                            (
                                {
                                    executionStatus,
                                    activationStatus,
                                    analysis,
                                    message,
                                    executionTime,
                                },
                                index
                            ) => (
                                <tr key={index}>
                                    <td>{analysis}</td>
                                    <td>{executionStatus}</td>
                                    <td>{activationStatus}</td>
                                    <td>{message}</td>
                                    <td>{executionTime}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </>
        );
    }
}
