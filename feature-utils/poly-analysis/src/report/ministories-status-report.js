import React from "react";

/**
 * A "fake" report story that shows the status of executed analyses, providing a
 * similar interface to analyses included in reports.
 *
 * @todo This is out of place in poly-analysis; stories being a concept that
 * currently doesn't really exist in this library.
 */
class MinistoriesStatusReport {
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

export default MinistoriesStatusReport;
