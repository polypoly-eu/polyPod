import { readJSONDataObject } from "../importer-util.js";
import DirectKeyDataImporter from "./direct-key-data-importer.js";

const fileName = "profile_information/profile_information.json";

export default class NameImporter extends DirectKeyDataImporter {
    async _readLanguageData(zipFile) {
        return await readJSONDataObject(fileName, "profile_v2", zipFile);
    }

    async import({ zipFile }, facebookAccount) {
        const profileData = await this._readLanguageData(zipFile);
        facebookAccount.name = profileData?.name?.full_name;
    }
}
