import DirectKeyDataImporter from "./direct-key-data-importer.js";
import { OLD_PAGES_DIRECTORY } from "./paths.js";

export const UNFOLLOWED_PAGES_FILE_PATH = `${OLD_PAGES_DIRECTORY}/pages_you've_unfollowed.json`;
export const UNFOLLOWED_PAGES_DATA_KEY = "pages_unfollowed_v2";
export const UNFOLLOWED_PAGES_STORAGE_KEY = "unfollowedPages";

export default class UnfollowedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            UNFOLLOWED_PAGES_FILE_PATH,
            UNFOLLOWED_PAGES_DATA_KEY,
            UNFOLLOWED_PAGES_STORAGE_KEY
        );
    }
}
