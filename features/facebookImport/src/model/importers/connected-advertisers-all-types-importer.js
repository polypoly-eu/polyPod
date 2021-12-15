import ConnectedAdvertiser from "../entities/connected-advertiser.js";
import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const CONNECTED_ADVERTISERS_ALL_TYPES_FILE_PATH =
    "ads_information/advertisers_using_your_activity_or_information.json";
export const CONNECTED_ADVERTISERS_ALL_TYPES_DATA_KEY =
    "custom_audiences_all_types_v2";
export const CONNECTED_ADVERTISERS_ALL_TYPES_STORAGE_KEY =
    "connectedAdvertisers";

export default class ConnectedAdvertisersAllTypesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            CONNECTED_ADVERTISERS_ALL_TYPES_FILE_PATH,
            CONNECTED_ADVERTISERS_ALL_TYPES_DATA_KEY,
            CONNECTED_ADVERTISERS_ALL_TYPES_STORAGE_KEY
        );
    }

    _createConnectedAdvertiser(advertiserData) {
        let connectedAdvertiser = new ConnectedAdvertiser();
        connectedAdvertiser.name = advertiserData.advertiser_name;

        connectedAdvertiser.hasDataFileCustomAudience =
            advertiserData.has_data_file_custom_audience;
        connectedAdvertiser.hasRemarketingCustomAudience =
            advertiserData.has_remarketing_custom_audience;
        connectedAdvertiser.hasInPersonStoreVisitme =
            advertiserData.has_in_person_store_visit;

        return connectedAdvertiser;
    }

    extractData(rawData) {
        return rawData.map((advertiserData) =>
            this._createConnectedAdvertiser(advertiserData)
        );
    }
}
