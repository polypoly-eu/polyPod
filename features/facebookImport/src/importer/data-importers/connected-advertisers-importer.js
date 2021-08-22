import { readJSONDataArray } from "./../../model/analysis-util.js";

export default class ConnectedAdvertisersImporter {
    async import({ zipFile, facebookAccount }) {
        const connectedAdvertisers = await readJSONDataArray(
            "ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json",
            "custom_audiences_v2",
            zipFile
        );
        if (connectedAdvertisers.status === "ok") {
            facebookAccount.connectedAdvertisers = connectedAdvertisers.data;
        }
    }
}
