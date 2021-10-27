import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class ReceivedFriendRequestsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "friends_and_followers/friend_requests_received.json",
            "received_requests_v2",
            "receivedFriendRequests"
        );
    }
}
