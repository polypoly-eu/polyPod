import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const LIKED_PAGES_FILE_PATH = "pages/pages_you've_liked.json";
export const LIKED_PAGES_DATA_KEY = "page_likes_v2";

export default class LikedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(LIKED_PAGES_FILE_PATH, LIKED_PAGES_DATA_KEY, "likedPages");
    }
}
