import { readJSONDataObject } from "./utils/importer-util.js";

const fileName = "profile_information/profile_information.json";

export default class NameImporter {
    async _readLanguageData(zipFile) {
        return readJSONDataObject(fileName, "profile_v2", zipFile);
    }

    async import({ zipFile, facebookAccount }) {
        const profileData = await this._readLanguageData(zipFile);
        facebookAccount.name = profileData.name.full_name;
    }
}
