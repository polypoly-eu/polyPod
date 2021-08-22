import { readJSONDataArray } from "../importer-util.js";

export default class InteractedWithAdvertisersImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.interactedAdvertisers = await readJSONDataArray(
            "ads_information/advertisers_you've_interacted_with.json",
            "history_v2",
            zipFile
        );
    }
}
