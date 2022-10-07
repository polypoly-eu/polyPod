import DirectKeyDataImporter from "./direct-key-data-importer.js";
import { PAGES_DIRECTORY } from "./paths.js";

export const LIKED_PAGES_FILE_PATH = `${PAGES_DIRECTORY}/pages_you've_liked.json`;
export const LIKED_PAGES_DATA_KEY = "page_likes_v2";
export const LIKED_PAGES_STORAGE_KEY = "likedPages";

export default class LikedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            LIKED_PAGES_FILE_PATH,
            LIKED_PAGES_DATA_KEY,
            LIKED_PAGES_STORAGE_KEY
        );
    }
}

LikedPagesImporter.STORAGE_KEY = "likedPages";
