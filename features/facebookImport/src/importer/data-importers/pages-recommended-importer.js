import { readJSONDataArray } from "../importer-util.js";

export default class RecommendedPagesImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "pages/pages_you've_recommended.json";
        facebookAccount.recommendedPages = await readJSONDataArray(
            fileName,
            "recommended_pages_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
