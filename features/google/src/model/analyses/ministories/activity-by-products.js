import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";
import { groupAnalysisByKey } from "../utils/analysis-tools";

export default class ActivityByProductAnalysis extends RootAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const activities = googleAccount.activities;
        const activitiesByProducts = groupAnalysisByKey(
            activities,
            "productName"
        );
        if (Object.keys(activitiesByProducts).length > 0)
            googleAccount.analyses[analysisKeys.activitiesByProducts] =
                activitiesByProducts;
    }
}
