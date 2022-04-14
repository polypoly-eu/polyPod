import React from "react";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../../analysisKeys";

export default class SesssionActivityLocationsAnalysis extends RootAnalysis {
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

        const locationsData = [];
        for (const [location_index, count] of Object.entries(
            locationByActivityCount
        )) {
            locationsData.push({ title: location_index, count });
        }

        if (locationsData.length > 0)
            dataAccount.analyses[analysisKeys.locationsData] = locationsData;
    }
}
