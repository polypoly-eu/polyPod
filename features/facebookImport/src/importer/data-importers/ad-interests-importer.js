import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class AdInterestsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "other_logged_information/ads_interests.json",
            "topics_v2",
            "adInterests"
        );
    }
}
