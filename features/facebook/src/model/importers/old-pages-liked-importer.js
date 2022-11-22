import DirectKeyDataImporter from "./direct-key-data-importer.js";
import { OLD_PAGES_DIRECTORY } from "./paths.js";

export const LIKED_PAGES_FILE_PATH = `${OLD_PAGES_DIRECTORY}/pages_you've_liked.json`;
export const LIKED_PAGES_DATA_KEY = "page_likes_v2";
export const LIKED_PAGES_STORAGE_KEY = "likedPages";

export default class OldLikedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            LIKED_PAGES_FILE_PATH,
            LIKED_PAGES_DATA_KEY,
            LIKED_PAGES_STORAGE_KEY
        );
    }
}

OldLikedPagesImporter.STORAGE_KEY = "likedPages";
