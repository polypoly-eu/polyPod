import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class AdvertisingValueAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        const adInterests = dataAccount.adInterests;
        const numberInterests = new Set(adInterests).size;
        const randomAdInterests = new Set();
        if (numberInterests > 0) {
            while (randomAdInterests.size < Math.min(3, numberInterests)) {
                randomAdInterests.add(
                    adInterests[Math.floor(Math.random() * adInterests.length)]
                );
            }
            dataAccount.analyses[analysisKeys.randomAdInterests] = [
                ...randomAdInterests,
            ];
        }
        dataAccount.analyses[analysisKeys.numberInterests] = numberInterests;

        dataAccount.analyses[analysisKeys.sortedAdInterests] = adInterests.sort(
            (a, b) => {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            }
        );
    }
}
