import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class InteractedWithAdvertisersImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "ads_information/advertisers_you've_interacted_with.json",
            "history_v2",
            "interactedAdvertisers"
        );
    }
}
