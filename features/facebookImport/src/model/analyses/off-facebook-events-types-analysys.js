import React from "react";
import BarChart from "../../components/dataViz/barChart.jsx";
import RootAnalysis from "./root-analysis.js";

export default class OffFacebookEventsTypesAnalysis extends RootAnalysis {
    get title() {
        return "Off-Facebook Events by Type";
    }

    async analyze({ facebookAccount }) {
        this.active = facebookAccount.offFacebookCompanies.length > 0;
        this._eventsTypeCountPairs = [];
        if (!this.active) {
            return;
        }

        const eventsCountByType = {};
        facebookAccount.forEachOffFacebookEvent((event) => {
            if (!eventsCountByType[event.type]) {
                eventsCountByType[event.type] = 0;
            }
            eventsCountByType[event.type]++;
        });

        for (const type in eventsCountByType) {
            this._eventsTypeCountPairs.push({
                type,
                count: eventsCountByType[type],
            });
        }

        this._eventsTypeCountPairs.sort(function (pairA, pairB) {
            return pairB.count - pairA.count;
        });
    }

    render() {
        if (!this.active) {
            return "No off-facebook events detected in your export!";
        }
        return (
            <>
                <table>
                    <tbody>
                        {this._eventsTypeCountPairs.map(
                            ({ type, count }, index) => (
                                <tr key={index}>
                                    <td>{type}</td>
                                    <td>{count}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                <BarChart data={this._eventsTypeCountPairs} names="type" />
            </>
        );
    }
}
