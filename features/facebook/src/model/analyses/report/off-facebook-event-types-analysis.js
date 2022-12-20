import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys.js";

export default class OffFacebookEventTypesAnalysis extends ReportAnalysis {
    get reportData() {
        return this._offFacebookEventTypes;
    }

    async analyze({ dataAccount }) {
        const offFacebookEventTypes = new Set();
        dataAccount.forEachOffFacebookEvent((event) => {
            if (event.type) {
                offFacebookEventTypes.add(event.type);
            }
        });
        if (offFacebookEventTypes.size > 0)
            dataAccount.reports[analysisKeys.offFacebookEventTypes] = [
                ...offFacebookEventTypes,
            ];
    }
}
