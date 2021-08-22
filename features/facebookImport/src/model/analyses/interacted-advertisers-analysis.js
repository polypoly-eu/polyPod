import RootAnalysis from "./root-analysis.js";

export default class InteractedWithAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return "Advertisers You've Interacted With";
    }

    async parse({ facebookAccount }) {
        this._advertisersCount = facebookAccount.interactedAdvertisers.length;
        this.active = this._advertisersCount > 0;
    }

    render() {
        if (!this.active) {
            return "No Interacted with Advertisers!";
        }
        return `There are ${this._advertisersCount} advertisers whose ads you've clicked on Facebook`;
    }
}
