import { readJSONDataArray } from "./utils/importer-util.js";
import { readRdfSeq, writeRdfSeq } from "./utils/rdf.js";

export const AD_INTERESTS_FILE_PATH =
    "other_logged_information/ads_interests.json";
export const AD_INTERESTS_DATA_KEY = "topics_v2";
export const AD_INTERESTS_STORAGE_KEY = "adInterests";

export default class AdInterestsImporter {
    async import({ zipFile, facebookAccount }) {
        let adInterests = await readRdfSeq(AD_INTERESTS_STORAGE_KEY);
        if (!adInterests) {
            adInterests = this.extractData(
                await readJSONDataArray(
                    AD_INTERESTS_FILE_PATH,
                    AD_INTERESTS_DATA_KEY,
                    zipFile
                )
            );
            writeRdfSeq(AD_INTERESTS_STORAGE_KEY, adInterests);
        } else {
            console.log("used rdf - adInterest");
        }

        facebookAccount[AD_INTERESTS_STORAGE_KEY] = adInterests;
        facebookAccount.addImportedFileName(this._dataFileName);
    }

    extractData(rawData) {
        return rawData;
    }
}
