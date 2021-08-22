import { readJSONDataArray } from "../importer-util.js";

export default class InteractedWithAdvertisersImporter {
    async import({ zipFile, facebookAccount }) {
        const advertisers = await readJSONDataArray(
            "ads_information/advertisers_you've_interacted_with.json",
            "history_v2",
            zipFile
        );
        if (advertisers.status === "ok") {
            facebookAccount.interactedAdvertisers = advertisers.data;
        }
    }
}
