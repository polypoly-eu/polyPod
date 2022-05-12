import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";
import { groupAnalysisByKey } from "../utils/analysis-tools";

export default class ActivitySegmentsAnalysis extends RootAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const activitySegments = googleAccount.activitySegments;
        const groupedActivityTypes = groupAnalysisByKey(
            activitySegments,
            "activityType"
        );

        if (Object.keys(groupedActivityTypes).length > 0)
            googleAccount.analyses[analysisKeys.groupedActivityTypes] =
                groupedActivityTypes;
    }
}
