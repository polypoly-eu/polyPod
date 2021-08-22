import { readJSONDataArray } from "../importer-util.js";

export default class ConnectedAdvertisersImporter {
    async import({ zipFile }, facebookAccount) {
        facebookAccount.connectedAdvertisers = await readJSONDataArray(
            "ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json",
            "custom_audiences_v2",
            zipFile
        );
    }
}
