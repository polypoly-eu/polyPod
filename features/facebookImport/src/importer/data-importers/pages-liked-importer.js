import { readJSONDataArray } from "../importer-util.js";

export default class LikedPagesImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "pages/pages_you've_liked.json";
        facebookAccount.likedPages = await readJSONDataArray(
            fileName,
            "page_likes_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
