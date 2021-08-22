import RootAnalysis from "./root-analysis.js";

export default class FriendsAnalysis extends RootAnalysis {
    get title() {
        return "Friends";
    }

    async parse({ facebookAccount }) {
        this._friendsCount = facebookAccount.friends.length;
        this.active = this._friendsCount > 0;
    }

    render() {
        if (!this.active) {
            return "No Friends!";
        }
        return `You are currently connected to ${this._friendsCount} people.`;
    }
}
