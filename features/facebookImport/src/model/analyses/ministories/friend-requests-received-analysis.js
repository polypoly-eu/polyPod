import RootAnalysis from "./root-analysis.js";

export default class ReceivedFriendRequestsAnalysis extends RootAnalysis {
    get title() {
        return "Received Friend Requests";
    }

    async analyze({ facebookAccount }) {
        this._receivedFriendRequestsCount =
            facebookAccount.receivedFriendRequests.length;
        this.active = this._receivedFriendRequestsCount > 0;
    }

    renderSummary() {
        return `You received ${this._receivedFriendRequestsCount} ${
            this._receivedFriendRequestsCount === 1 ? "request" : "requests"
        }. from others asking you to be friends on Facebook`;
    }
}
