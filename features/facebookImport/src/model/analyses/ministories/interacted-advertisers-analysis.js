import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class InteractedWithAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return "Advertisers You've Interacted With";
    }

    async analyze({ facebookAccount }) {
        this._advertisersCount = facebookAccount.interactedAdvertisers.length;
        this.active = this._advertisersCount > 0;
    }

    renderSummary() {
        return `There are ${this._advertisersCount} advertisers whose ads you've clicked on Facebook`;
    }
}
