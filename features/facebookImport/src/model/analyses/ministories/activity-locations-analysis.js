import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class SesssionActivityLocationsAnalysis extends RootAnalysis {
    get title() {
        return "Session Activity Locations";
    }

    async analyze({ dataAccount }) {
        const locationByActivityCount = {};
        dataAccount.accountSessionActivities
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

    renderSummary() {
        return (
            <BasicDataCountTable
                title={
                    "Locations contained in session activities, like log-in or log-out."
                }
                items={this._locationsData}
            />
        );
    }
}
