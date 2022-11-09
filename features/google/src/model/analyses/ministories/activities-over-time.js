import {
    groupActivitiesByTime,
    RootAnalysis,
} from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";

export default class ActivitiesOverTimeAnalysis extends RootAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const activities = googleAccount.activities;
        const groupedActivities = groupActivitiesByTime(
            activities.map(({ timestamp }) => timestamp)
        );

        if (Object.keys(groupedActivities).length > 0)
            googleAccount.analyses[analysisKeys.activitiesOverTime] =
                groupedActivities;
    }
}
