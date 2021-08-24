import { readJSONDataArray } from "../importer-util.js";

export default class UnfollowedPagesImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "pages/pages_you've_unfollowed.json";
        facebookAccount.unfollowedPages = await readJSONDataArray(
            fileName,
            "pages_unfollowed_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
