import DirectKeyDataImporter from "./direct-key-data-importer.js";
import { OLD_PAGES_DIRECTORY } from "./paths.js";

export const FOLLOWED_PAGES_FILE_PATH = `${OLD_PAGES_DIRECTORY}/pages_you_follow.json`;
export const FOLLOWED_PAGES_DATA_KEY = "pages_followed_v2";
export const FOLLOWED_PAGES_STORAGE_KEY = "followedPages";

export default class OldFollowedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            FOLLOWED_PAGES_FILE_PATH,
            FOLLOWED_PAGES_DATA_KEY,
            FOLLOWED_PAGES_STORAGE_KEY
        );
    }
}

OldFollowedPagesImporter.STORAGE_KEY = "followedPages";
