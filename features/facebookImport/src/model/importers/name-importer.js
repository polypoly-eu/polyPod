import { readJSONDataObject } from "./utils/importer-util.js";

const fileName = "profile_information/profile_information.json";

export default class NameImporter {
    async _readLanguageData(id, zipFile) {
        return readJSONDataObject(fileName, "profile_v2", zipFile, id);
    }

    async import({ id, zipFile }, facebookAccount) {
        const profileData = await this._readLanguageData(id, zipFile);
        facebookAccount.name = profileData.name.full_name;
    }
}
