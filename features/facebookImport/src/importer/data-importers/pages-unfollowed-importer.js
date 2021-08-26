import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class UnfollowedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "pages/pages_you've_unfollowed.json",
            "pages_unfollowed_v2",
            "unfollowedPages"
        );
    }
}
