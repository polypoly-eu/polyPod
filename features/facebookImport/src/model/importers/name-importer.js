import { readJSONDataObject } from "./utils/importer-util.js";
import { readAttrFromRdf, writeAttrToRdf } from "./utils/rdf.js";

export const PROFILE_INFORMATION_FILE_PATH =
    "profile_information/profile_information.json";
export const PROFILE_INFORMATION_DATA_KEY = "profile_v2";
const PROFILE_INFORMATION_STORAGE_KEY = "name";

export default class NameImporter {
    async _readLanguageData(zipFile) {
        return readJSONDataObject(
            PROFILE_INFORMATION_FILE_PATH,
            PROFILE_INFORMATION_DATA_KEY,
            zipFile
        );
    }

    async import({ zipFile, facebookAccount }) {
        const rdfResult = await readAttrFromRdf(
            facebookAccount.id,
            PROFILE_INFORMATION_STORAGE_KEY
        );

        if (rdfResult) {
            console.log("used rdf - name");
            facebookAccount.name = rdfResult;
            return;
        }

        const profileData = await this._readLanguageData(zipFile);
        await writeAttrToRdf(
            facebookAccount.id,
            PROFILE_INFORMATION_STORAGE_KEY,
            profileData.name.full_name
        );

        facebookAccount.name = profileData.name.full_name;
    }
}
