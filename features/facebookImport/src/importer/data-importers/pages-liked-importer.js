import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class LikedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super("pages/pages_you've_liked.json", "page_likes_v2", "likedPages");
    }
}
