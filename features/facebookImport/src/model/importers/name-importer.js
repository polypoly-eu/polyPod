import { readJSONDataObject } from "./utils/importer-util.js";
import { readAttrFromRdf, writeAttributeToRdf } from "./utils/rdf.js";

export const PROFILE_INFORMATION_FILE_PATH =
    "profile_information/profile_information.json";
export const PROFILE_INFORMATION_DATA_KEY = "profile_v2";

export default class NameImporter {
    async _readLanguageData(zipFile) {
        return readJSONDataObject(
            PROFILE_INFORMATION_FILE_PATH,
            PROFILE_INFORMATION_DATA_KEY,
            zipFile
        );
    }

    async import({ zipFile, facebookAccount }) {
        const rdfResult = await readAttrFromRdf(facebookAccount.id, "name");

        if (rdfResult) {
            console.log("used rdf");
            facebookAccount.name = rdfResult;
            return;
        }

        const profileData = await this._readLanguageData(zipFile);

        await writeAttributeToRdf(
            facebookAccount.id,
            "name",
            profileData.name.full_name
        );

        facebookAccount.name = profileData.name.full_name;
    }
}
