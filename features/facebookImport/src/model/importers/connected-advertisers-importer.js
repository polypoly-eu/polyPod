import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH =
    "ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json";
export const CONNECTED_ADVERTISERS_DATA_KEY = "custom_audiences_v2";
export const CONNECTED_ADVERTISERS_STORAGE_KEY = "connectedAdvertisers";

export default class ConnectedAdvertisersImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH,
            CONNECTED_ADVERTISERS_DATA_KEY,
            CONNECTED_ADVERTISERS_STORAGE_KEY
        );
    }
}
