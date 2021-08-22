import { readJSONDataArray } from "../importer-util.js";

export default class SearchesImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.searches = await readJSONDataArray(
            "search/your_search_history.json",
            "searches_v2",
            zipFile
        );
    }
}
