import { readJSONDataArray } from "./../../model/analysis-util.js";

export default class SearchesImporter {
    async import({ zipFile, facebookAccount }) {
        const searches = await readJSONDataArray(
            "search/your_search_history.json",
            "searches_v2",
            zipFile
        );
        if (searches.status === "ok") {
            facebookAccount.searches = searches.data;
        }
    }
}
