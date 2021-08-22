import { readJSONDataArray } from "../importer-util.js";

export default class UnfollowedPagesImporter {
    async import({ zipFile, facebookAccount }) {
        const unfollowedPages = await readJSONDataArray(
            "pages/pages_you've_unfollowed.json",
            "pages_unfollowed_v2",
            zipFile
        );
        if (unfollowedPages.status === "ok") {
            facebookAccount.unfollowedPages = unfollowedPages.data;
        }
    }
}
