import {
    groupActivitiesByTime,
    RootAnalysis,
} from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";

export default class ActivitiesOverTimeAnalysis extends RootAnalysis {
    async analyze({ dataAccount: whatsAppAccount }) {
        const activities = whatsAppAccount.activities;
        const groupedActivities = groupActivitiesByTime(
            activities.map(({ timestamp }) => timestamp)
        );

        if (Object.keys(activities).length > 0)
            whatsAppAccount.analyses[analysisKeys.activitiesOverTime] =
                groupedActivities;
    }
}
