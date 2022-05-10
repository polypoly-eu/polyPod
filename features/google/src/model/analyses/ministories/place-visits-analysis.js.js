import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import { mapToChartDataArray } from "@polypoly-eu/poly-look";
import analysisKeys from "../analysisKeys";

export default class PlaceVisitsAnalysis extends RootAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const placeVisits = googleAccount.placeVisits;
        const groupedPlaceVisits = {};
        placeVisits.forEach((place) => {
            if (!groupedPlaceVisits[place.locationName])
                groupedPlaceVisits[place.locationName] = 1;
            else groupedPlaceVisits[place.locationName] += 1;
        });
        if (Object.keys(groupedPlaceVisits).length > 0)
            googleAccount.analyses[analysisKeys.groupedPlaceVisits] =
                mapToChartDataArray(groupedPlaceVisits)
                    .sort((a, b) => b - a)
                    .slice(0, 10);
    }
}
