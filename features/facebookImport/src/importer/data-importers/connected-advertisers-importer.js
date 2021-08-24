import { readJSONDataArray } from "../importer-util.js";

export default class ConnectedAdvertisersImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName =
            "ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json";
        facebookAccount.connectedAdvertisers = await readJSONDataArray(
            fileName,
            "custom_audiences_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);
    }
}
