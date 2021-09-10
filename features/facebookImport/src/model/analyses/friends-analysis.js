import RootAnalysis from "./root-analysis.js";

export default class FriendsAnalysis extends RootAnalysis {
    get title() {
        return "Friends";
    }

    async analyze({ facebookAccount }) {
        this._friendsCount = facebookAccount.friends.length;
        this.active = this._friendsCount > 0;
    }

    renderSummary() {
        return `You are currently connected to ${this._friendsCount} people.`;
    }
}
