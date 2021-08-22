import { readJSONDataArray } from "./../../model/analysis-util.js";

export default class FollowedPagesImporter {
    async import({ zipFile, facebookAccount }) {
        const followedPages = await readJSONDataArray(
            "pages/pages_you_follow.json",
            "pages_followed_v2",
            zipFile
        );
        if (followedPages.status === "ok") {
            facebookAccount.followedPages = followedPages.data;
        }
    }
}
