import RootAnalysis from "./root-analysis.js";

export default class AdInterestsAnalysis extends RootAnalysis {
    get title() {
        return "Ads Interests";
    }

    async analyze({ facebookAccount }) {
        this._adInterestsCount = facebookAccount.adInterests.length;
        this.active = this._adInterestsCount > 0;
    }

    renderSummary() {
        return `There are ${this._adInterestsCount} interests infered based on your Facebook activity and other actions that help Facebook show you relevant ads`;
    }
}
