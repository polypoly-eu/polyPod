import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";

export default class ActivityByProductAnalysis extends RootAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const activities = googleAccount.activities;
        const activitiesByProducts = {};
        activities.forEach((activity) => {
            if (!activitiesByProducts[activity.productName])
                activitiesByProducts[activity.productName] = 1;
            else activitiesByProducts[activity.productName] += 1;
        });
        if (Object.keys(activitiesByProducts).length > 0)
            googleAccount.analyses[analysisKeys.activitiesByProducts] =
                activitiesByProducts;
    }
}
