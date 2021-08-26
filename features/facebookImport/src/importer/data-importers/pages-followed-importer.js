import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class FollowedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "pages/pages_you_follow.json",
            "pages_followed_v2",
            "followedPages"
        );
    }
}
