import { readJSONDataArray } from "../importer-util.js";

export default class LikedPagesImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.likedPages = await readJSONDataArray(
            "pages/pages_you've_liked.json",
            "page_likes_v2",
            zipFile
        );
    }
}
