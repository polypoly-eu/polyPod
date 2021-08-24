import { readJSONDataArray } from "../importer-util.js";

export default class SearchesImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "search/your_search_history.json";
        facebookAccount.searches = await readJSONDataArray(
            fileName,
            "searches_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
