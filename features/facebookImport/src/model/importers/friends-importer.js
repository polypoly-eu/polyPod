import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const FRIENDS_FILE_PATH = "friends_and_followers/friends.json";
export const FRIENDS_DATA_KEY = "friends_v2";
export const FRIENDS_STORAGE_KEY = "friends";

export default class FriendsImporter extends DirectKeyDataImporter {
    constructor() {
        super(FRIENDS_FILE_PATH, FRIENDS_DATA_KEY, FRIENDS_STORAGE_KEY);
    }
}
