import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class RecommendedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "pages/pages_you've_recommended.json",
            "recommended_pages_v2",
            "recommendedPages"
        );
    }
}
