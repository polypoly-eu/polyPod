import { readJSONDataArray } from "../../model/analysis-util.js";

export default class RecommendedPagesImporter {
    async import({ zipFile, facebookAccount }) {
        const recommendedPages = await readJSONDataArray(
            "pages/pages_you've_recommended.json",
            "recommended_pages_v2",
            zipFile
        );
        if (recommendedPages.status === "ok") {
            facebookAccount.recommendedPages = recommendedPages.data;
        }
    }
}
