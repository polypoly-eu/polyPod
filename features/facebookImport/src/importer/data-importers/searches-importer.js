import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class SearchesImporter extends DirectKeyDataImporter {
    constructor() {
        super("search/your_search_history.json", "searches_v2", "searches");
    }
}
