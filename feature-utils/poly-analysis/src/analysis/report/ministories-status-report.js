import React from "react";

/**
 * I am a "fake" analysis that shows the status of running analyses.
 * I do not have an analyse method as I get the data directly in the constructor.
 *
 * I provide the same API as an analysis that should be included in a report.
 *
 * @class
 */
export default class MinistoriesStatusReport {
    constructor(ministories) {
        this._ministoriesData = ministories.map((ministory) => {
            return {
                id: ministory.constructor.name,
                status: ministory.active ? "ACTIVE" : "INACTIVE",
            };
        });
        this.active = this._ministoriesData.length > 0;
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
            data: this._ministoriesData,
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
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._ministoriesData.map(({ id, status }, index) => (
                            <tr key={index}>
                                <td>{id}</td>
                                <td>{status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }
}
