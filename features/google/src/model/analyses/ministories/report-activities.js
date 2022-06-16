import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";

export default class ReportActivities extends ReportAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const activities = googleAccount.activityFileInfo;
        if (activities.length > 0) {
            googleAccount.reports[analysisKeys.reportActivities] =
                activities.map((activity) => {
                    return {
                        activityName: activity.productName,
                        fileSize: activity.fileSize,
                    };
                });
        }
    }
}
