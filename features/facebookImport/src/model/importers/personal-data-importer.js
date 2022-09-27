import { readJSONDataObject } from "./utils/importer-util.js";

export const PROFILE_INFORMATION_FILE_PATH =
    "profile_information/profile_information.json";
export const PROFILE_INFORMATION_DATA_KEY = "profile_v2";
export const PERSONAL_DATA_STORAGE_KEY = "personalData";

export default class PersonalDataImporter {
    async _readLanguageData(zipFile) {
        return readJSONDataObject(
            PROFILE_INFORMATION_FILE_PATH,
            PROFILE_INFORMATION_DATA_KEY,
            zipFile
        );
    }

    async import({ zipFile }) {
        const profileData = await this._readLanguageData(zipFile);
        const name = {
            givenName: profileData.name.first_name,
            additionalName: profileData.name.middle_name,
            lastName: profileData.name.last_name,
        };

        return {
            result: { name },
            importedFileNames: [PROFILE_INFORMATION_FILE_PATH],
        };
    }
}

PersonalDataImporter.STORAGE_KEY = "personalData";
