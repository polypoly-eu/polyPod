import React from "react";
import RootAnalysis from "./root-analysis";

export default class DataGroupsAnalysis extends RootAnalysis {
    get title() {
        return "Data Groups";
    }

    async analyze({ facebookAccount }) {
        this._bubblesData = facebookAccount.dataGroups.filter(
            ({ count }) => count > 0
        );
        this.active = this._bubblesData.length > 0;
    }

    render() {
        return (
            <table>
                <tbody>
                    {this._bubblesData.map(({ title, count }, index) => (
                        <tr key={index}>
                            <td>{title}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
