import { ReportAnalysis } from "@polypoly-eu/poly-analysis";

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
        if (offFacebookEventTypes.length > 0)
            dataAccount.processedData._offFacebookEventTypes = [
                ...offFacebookEventTypes,
            ];
    }
}
