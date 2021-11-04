import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const SEARCHES_INTERESTS_FILE_PATH = "search/your_search_history.json";
export const SEARCHES_INTERESTS_DATA_KEY = "searches_v2";
export const SEARCHES_INTERESTS_STORAGE_KEY = "searches";

export default class SearchesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            SEARCHES_INTERESTS_FILE_PATH,
            SEARCHES_INTERESTS_DATA_KEY,
            SEARCHES_INTERESTS_STORAGE_KEY
        );
    }
}
