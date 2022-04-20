import React from "react";

/**
 * I am a "fake" analysis that shows issues when running analyses.
 * I do not have an analyse method as I get the data directly in the constructor.
 *
 * I provide the same API as an analysis that should be included in a report.
 *
 * @class
 */
export default class InactiveCardsSummary {
    constructor(analysesResults) {
        const inactiveAnalysesResults = analysesResults.filter(
            ({ analysis, status }) => !status.isSuccess || !analysis.active
        );

        this._inactiveAnalysesData = inactiveAnalysesResults.map(
            ({ analysis, status }) => {
                return {
                    analysis: analysis.id,
                    activationStatus: analysis.active ? "ACTIVE" : "INACTIVE",
                    executionStatus: status.name,
                    message: status.message,
                };
            }
        );
        this.active =
            this._inactiveAnalysesData.length ==
                inactiveAnalysesResults.length &&
            this._inactiveAnalysesData.length > 0;
    }

    get title() {
        return "Inactive Analyses";
    }

    get id() {
        return this.constructor.name;
    }

    get jsonReport() {
        return {
            id: this.id,
            data: this._inactiveAnalysesData,
        };
    }

    render() {
        console.log(
            "THIS IS WHAT I NEED FROM YOU RICHARD: ",
            this._inactiveAnalysesData
        );
        return (
            <>
                <p>
                    Analyses that were not activated. This is a technical view
                    giving details of why the view was not active.
                </p>
                <table>
                    <tbody>
                        {this._inactiveAnalysesData.map(
                            (
                                {
                                    executionStatus,
                                    activationStatus,
                                    analysis,
                                    message,
                                },
                                index
                            ) => (
                                <tr key={index}>
                                    <td>{analysis}</td>
                                    <td>{executionStatus}</td>
                                    <td>{activationStatus}</td>
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
