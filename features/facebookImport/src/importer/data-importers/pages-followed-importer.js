import { readJSONDataArray } from "../importer-util.js";

export default class FollowedPagesImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.followedPages = await readJSONDataArray(
            "pages/pages_you_follow.json",
            "pages_followed_v2",
            zipFile
        );
    }
}
