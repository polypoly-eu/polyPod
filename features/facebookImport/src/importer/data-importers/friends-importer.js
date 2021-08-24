import { readJSONDataArray } from "../importer-util.js";

export default class FriendsImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "friends_and_followers/friends.json";
        facebookAccount.friends = await readJSONDataArray(
            fileName,
            "friends_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
