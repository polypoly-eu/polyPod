import React from "react";

/**
 * I am a "fake" report-reportStory that shows the status of executed analyses.
 * I do not have an analyse method as I get the data directly in the constructor.
 *
 * I provide the same API as an analysis that should be included in a report.
 *
 * @class MinistoriesStatusReport
 */
export default class MinistoriesStatusReport {
    constructor({ ministories, title, description }) {
        this._ministoriesData = ministories.map((ministory) => {
            return {
                id: ministory.constructor.name,
                status: ministory.active ? "ACTIVE" : "INACTIVE",
            };
        });
        this.active = this._ministoriesData.length > 0;
        this.title = title;
        this.description = description;
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
                <p>{this.description}</p>
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
