import RootAnalysis from "./root-analysis.js";

export default class InteractedWithAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return "Advertisers You've Interacted With";
    }

    async analyze({ facebookAccount }) {
        this._advertisersCount = facebookAccount.interactedAdvertisers.length;
        this.active = this._advertisersCount > 0;
    }

    renderSummary() {
        if (!this.active) {
            return "No Interacted with Advertisers!";
        }
        return `There are ${this._advertisersCount} advertisers whose ads you've clicked on Facebook`;
    }
}
