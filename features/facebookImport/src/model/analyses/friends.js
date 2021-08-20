import DataEntitiesCountAnalysis from "./data-count.js";

class FriendsAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super("friends_and_followers/friends.json", "friends_v2");
    }
    get title() {
        return "Friends";
    }

    render() {
        if (!this.active) {
            return "No Friends!";
        }
        return `You are currently connected to ${this.dataEntitiesCount} people.`;
    }
}

export default FriendsAnalysis;
