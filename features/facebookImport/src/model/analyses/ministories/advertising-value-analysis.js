import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class AdvertisingValueAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        const adInterests = dataAccount.adInterests;
        const numberInterests = new Set(adInterests).size;
        dataAccount.analyses[analysisKeys.numberInterests] = numberInterests;
        dataAccount.analyses[analysisKeys.sortedAdInterests] = adInterests.sort(
            (a, b) => {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            }
        );
    }
}
