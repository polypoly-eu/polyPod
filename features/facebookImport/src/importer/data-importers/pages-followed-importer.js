import { readJSONDataArray } from "../importer-util.js";

export default class FollowedPagesImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "pages/pages_you_follow.json";
        facebookAccount.followedPages = await readJSONDataArray(
            fileName,
            "pages_followed_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
