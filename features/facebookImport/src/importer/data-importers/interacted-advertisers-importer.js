import { readJSONDataArray } from "../importer-util.js";

export default class InteractedWithAdvertisersImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName =
            "ads_information/advertisers_you've_interacted_with.json";
        facebookAccount.interactedAdvertisers = await readJSONDataArray(
            fileName,
            "history_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
