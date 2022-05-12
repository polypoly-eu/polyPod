import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import { mapToChartDataArray } from "@polypoly-eu/poly-look";
import analysisKeys from "../analysisKeys";
import { groupAnalysisByKey } from "../utils/analysis-tools";

export default class PlaceVisitsAnalysis extends RootAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const placeVisits = googleAccount.placeVisits;
        const groupedPlaceVisits = groupAnalysisByKey(
            placeVisits,
            "locationName"
        );
        if (Object.keys(groupedPlaceVisits).length > 0)
            googleAccount.analyses[analysisKeys.groupedPlaceVisits] =
                mapToChartDataArray(groupedPlaceVisits)
                    .sort((a, b) => b - a)
                    .slice(0, 10);
    }
}
