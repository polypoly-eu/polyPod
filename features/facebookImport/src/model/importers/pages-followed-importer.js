import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const FOLLOWED_PAGES_FILE_PATH = "pages/pages_you_follow.json";
export const FOLLOWED_PAGES_DATA_KEY = "pages_followed_v2";
export const FOLLOWED_PAGES_STORAGE_KEY = "followedPages";

export default class FollowedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            FOLLOWED_PAGES_FILE_PATH,
            FOLLOWED_PAGES_DATA_KEY,
            FOLLOWED_PAGES_STORAGE_KEY
        );
    }
}
