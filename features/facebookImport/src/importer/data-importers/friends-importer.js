import { readJSONDataArray } from "../importer-util.js";

export default class FriendsImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.friends = await readJSONDataArray(
            "friends_and_followers/friends.json",
            "friends_v2",
            zipFile
        );
    }
}
