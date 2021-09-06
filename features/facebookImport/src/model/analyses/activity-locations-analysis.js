import React from "react";
import RootAnalysis from "./root-analysis.js";

export default class SesssionActivityLocationsAnalysis extends RootAnalysis {
    get title() {
        return "Session Activity Locations";
    }

    async analyze({ facebookAccount }) {
        const locationByActivityCount = {};
        facebookAccount.accountSessionActivities
            .filter(
                (activity) =>
                    activity.region && activity.city && activity.country
            )
            .forEach((activity) => {
                const location =
                    activity.region +
                    ", " +
                    activity.city +
                    ", " +
                    activity.country;
                locationByActivityCount[location] === undefined
                    ? (locationByActivityCount[location] = 1)
                    : locationByActivityCount[location]++;
            });

        this._locationsData = [];
        for (const [location_index, count] of Object.entries(
            locationByActivityCount
        )) {
            this._locationsData.push({ title: location_index, count });
        }

        this.active = this._locationsData.length > 0;
    }

    render() {
        if (!this.active) {
            return "No Session Activities!";
        }
        return (
            <>
                Locations contained in session activities, like log-in or
                log-out.
                <table>
                    <tbody>
                        {this._locationsData.map(({ title, count }, index) => (
                            <tr key={index}>
                                <td>{title}</td>
                                <td>{count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }
}
