import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const INTERACTED_WITH_ADVERTISERS_FILE_PATH =
    "ads_information/advertisers_you've_interacted_with.json";
export const INTERACTED_WITH_ADVERTISERS_DATA_KEY = "history_v2";
export const INTERACTED_WITH_ADVERTISERS_STORAGE_KEY = "interactedAdvertisers";

export default class InteractedWithAdvertisersImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            INTERACTED_WITH_ADVERTISERS_FILE_PATH,
            INTERACTED_WITH_ADVERTISERS_DATA_KEY,
            INTERACTED_WITH_ADVERTISERS_STORAGE_KEY
        );
    }
}
