import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const RECEIVED_FRIEND_REQUESTS_FILE_PATH =
    "friends_and_followers/friend_requests_received.json";
export const RECEIVED_FRIEND_REQUESTS_DATA_KEY = "received_requests_v2";
export const RECEIVED_FRIEND_REQUESTS_STORAGE_KEY = "receivedFriendRequests";

export default class ReceivedFriendRequestsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            RECEIVED_FRIEND_REQUESTS_FILE_PATH,
            RECEIVED_FRIEND_REQUESTS_DATA_KEY,
            RECEIVED_FRIEND_REQUESTS_STORAGE_KEY
        );
    }
}
