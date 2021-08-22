import { readJSONDataArray } from "../importer-util.js";

export default class UnfollowedPagesImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.unfollowedPages = await readJSONDataArray(
            "pages/pages_you've_unfollowed.json",
            "pages_unfollowed_v2",
            zipFile
        );
    }
}
