import { readJSONDataArray } from "../importer-util.js";

export default class ReceivedFriendRequestsImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.receivedFriendRequests = await readJSONDataArray(
            "friends_and_followers/friend_requests_received.json",
            "received_requests_v2",
            zipFile
        );
    }
}
