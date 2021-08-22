import { readJSONDataArray } from "./../../model/analysis-util.js";

export default class LikedPagesImporter {
    async import({ zipFile, facebookAccount }) {
        const likedPages = await readJSONDataArray(
            "pages/pages_you've_liked.json",
            "page_likes_v2",
            zipFile
        );
        if (likedPages.status === "ok") {
            facebookAccount.likedPages = likedPages.data;
        }
    }
}
