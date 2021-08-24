import { readJSONDataArray } from "../importer-util.js";

export default class AdInterestsImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName = "other_logged_information/ads_interests.json";
        facebookAccount.adInterests = await readJSONDataArray(
            fileName,
            "topics_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
