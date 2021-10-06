import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class FriendsImporter extends DirectKeyDataImporter {
    constructor() {
        super("friends_and_followers/friends.json", "friends_v2", "friends");
    }
}
