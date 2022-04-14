import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class AdvertisingValueAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        const adInterests = dataAccount.adInterests;
        const numberInterests = new Set(adInterests).size;
        const randomAdInterests = new Set();
        this.active = false;
        if (numberInterests > 0) {
            while (randomAdInterests.size < Math.min(3, numberInterests)) {
                randomAdInterests.add(
                    adInterests[Math.floor(Math.random() * adInterests.length)]
                );
            }
            this.active = true;
        }
        this._randomAdInterests = [...randomAdInterests];
        this._numberInterests = numberInterests;
        this._displayData = adInterests.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
    }
}
