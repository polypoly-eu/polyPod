import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const AD_INTERESTS_FILE_PATH =
    "other_logged_information/ads_interests.json";
export const AD_INTERESTS_DATA_KEY = "topics_v2";
export const AD_INTERESTS_STORAGE_KEY = "adInterests";

export default class AdInterestsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            AD_INTERESTS_FILE_PATH,
            AD_INTERESTS_DATA_KEY,
            AD_INTERESTS_STORAGE_KEY
        );
    }
}
