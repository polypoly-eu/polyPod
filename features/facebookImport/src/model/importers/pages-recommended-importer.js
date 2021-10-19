import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const RECOMMENDED_PAGES_FILE_PATH =
    "pages/pages_you've_recommended.json";
export const RECOMMENDED_PAGES_DATA_KEY = "recommended_pages_v2";
export const RECOMMENDED_PAGES_STORAGE_KEY = "recommendedPages";

export default class RecommendedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            RECOMMENDED_PAGES_FILE_PATH,
            RECOMMENDED_PAGES_DATA_KEY,
            RECOMMENDED_PAGES_STORAGE_KEY
        );
    }
}
