import DataEntitiesCountAnalysis from "./data-count.js";

class ReceivedFriendRequestsAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super(
            "friends_and_followers/friend_requests_received.json",
            "received_requests_v2"
        );
    }
    get title() {
        return "Received Friend Requests";
    }

    render() {
        if (!this.active) {
            return "No Received Friend Requests!";
        }
        return `You received ${this.dataEntitiesCount} ${
            this.dataEntitiesCount === 1 ? "request" : "requests"
        }. from others asking you to be friends on Facebook`;
    }
}

export default ReceivedFriendRequestsAnalysis;
