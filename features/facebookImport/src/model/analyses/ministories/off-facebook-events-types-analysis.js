import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";
import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

export default class OffFacebookEventsTypesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        this._eventsTypeCountPairs = [];
        if (!(dataAccount.offFacebookCompanies.length > 0)) {
            return;
        } else {
            dataAccount.analyses[analysisKeys.eventsTypeCountPairs] =
                groupOffFacebookEventsByType(dataAccount);
        }
    }
}
