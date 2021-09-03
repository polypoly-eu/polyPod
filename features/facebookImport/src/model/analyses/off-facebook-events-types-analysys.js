import React from "react";
import RootAnalysis from "./root-analysis.js";
import { groupOffFacebookEventsByType } from "./utils/off-facebook-events-utils.js";

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

        this._eventsTypeCountPairs =
            groupOffFacebookEventsByType(facebookAccount);
    }

    render() {
        if (!this.active) {
            return "No off-facebook events detected in your export!";
        }
        return (
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
        );
    }
}
