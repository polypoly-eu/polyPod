import { Status, statusTypes } from "@polypoly-eu/poly-import";
import { readJSONDataArray } from "./utils/importer-util.js";
import { readObjFromFile, writeObjToFile } from "./utils/rdf.js";

export const LANGUAGE_AND_LOCALE_FILE_PATH =
    "preferences/language_and_locale.json";
export const LANGUAGE_AND_LOCALE_DATA_KEY = "language_and_locale_v2";
const LANGUAGE_AND_LOCALE_STORED_DATA_KEY = "preferredLanguage";

/**
 * Attempt to extract the language set by the user in the profile.
 *
 * Not the nicest code, as there is no metadata alowing use to identify
 * the language selected by the user. Assume the language data is an array
 * of entries having the following format:
 *
 * {
 *   "name": "Language Settings",
 *   "description": "Your preferred language settings",
 *   "children": [
 *   {
 *      "name": "Selected Language",
 *      "description": "The language you've chosen for your Facebook experience",
 *      "entries": [
 *         {
 *           "data": {
 *             "value": "en_US"
 *           }
 *         }
 *       ]
 *    }
 *   ]
 * },
 *
 * We take the first entry from the array that matches the above format.
 * In all the current exports that we saw the first entry was the language set by the user.
 * In case it is not, the "name", and "description" attributes still allow us to infer the language.
 *
 * @class
 */
export default class LanguageAndLocaleImporter {
    async readLanguageData(zipFile) {
        return await readJSONDataArray(
            LANGUAGE_AND_LOCALE_FILE_PATH,
            LANGUAGE_AND_LOCALE_DATA_KEY,
            zipFile
        );
    }

    extractPreferredLanguge(languageData) {
        const languageEntry = languageData.find((entry) => {
            if (!entry.children || !entry.children.length) return;
            const childEntry = entry.children[0];
            return (
                childEntry.entries.length === 1 &&
                childEntry.entries[0].data?.value !== undefined
            );
        });
        if (!languageEntry) return;
        const childEntry = languageEntry.children[0].entries[0];
        return {
            name: languageEntry.children[0].name,
            code: childEntry.data.value,
        };
    }

    async import({ zipFile, facebookAccount }) {
        const storedLanguage = await readObjFromFile(
            facebookAccount.id,
            LANGUAGE_AND_LOCALE_STORED_DATA_KEY
        );

        if (storedLanguage) {
            facebookAccount[LANGUAGE_AND_LOCALE_STORED_DATA_KEY] =
                storedLanguage;
            console.log("used rdf - preferredLanguage");
            return;
        }

        const languageData = await this.readLanguageData(zipFile);
        const preferredLanguage = this.extractPreferredLanguge(languageData);
        facebookAccount[LANGUAGE_AND_LOCALE_STORED_DATA_KEY] =
            preferredLanguage;

        if (!facebookAccount[LANGUAGE_AND_LOCALE_STORED_DATA_KEY]) {
            return new Status({
                name: statusTypes.warning,
                message: "Could not extract preferredLanguage",
            });
        }
        writeObjToFile(
            facebookAccount.id,
            LANGUAGE_AND_LOCALE_STORED_DATA_KEY,
            preferredLanguage
        );
    }
}
