import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";

export default class ActivitySegmentsAnalysis extends RootAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const activitySegments = googleAccount.activitySegments;
        const groupedActivityTypes = {};
        activitySegments.forEach((activitySegment) => {
            if (!groupedActivityTypes[activitySegment.activityType])
                groupedActivityTypes[activitySegment.activityType] = 1;
            else groupedActivityTypes[activitySegment.activityType] += 1;
        });
        if (Object.keys(groupedActivityTypes).length > 0)
            googleAccount.analyses[analysisKeys.groupedActivityTypes] =
                groupedActivityTypes;
    }
}
