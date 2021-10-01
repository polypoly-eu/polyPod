import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class ConnectedAdvertisersImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json",
            "custom_audiences_v2",
            "connectedAdvertisers"
        );
    }
}
