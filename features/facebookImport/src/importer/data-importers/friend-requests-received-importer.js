import { readJSONDataArray } from "./../../model/analysis-util.js";

export default class ReceivedFriendRequestsImporter {
    async import({ zipFile, facebookAccount }) {
        const receivedFriendRequests = await readJSONDataArray(
            "friends_and_followers/friend_requests_received.json",
            "received_requests_v2",
            zipFile
        );
        if (receivedFriendRequests.status === "ok") {
            facebookAccount.receivedFriendRequests =
                receivedFriendRequests.data;
        }
    }
}
