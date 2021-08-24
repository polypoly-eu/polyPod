import { readJSONDataArray } from "../importer-util.js";

export default class ReceivedFriendRequestsImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "friends_and_followers/friend_requests_received.json";

        facebookAccount.receivedFriendRequests = await readJSONDataArray(
            fileName,
            "received_requests_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
