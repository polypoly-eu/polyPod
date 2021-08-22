import { readJSONDataArray } from "../importer-util.js";

export default class AdInterestsImporter {
    async import({ zipFile, facebookAccount }) {
        const adInterests = await readJSONDataArray(
            "other_logged_information/ads_interests.json",
            "topics_v2",
            zipFile
        );
        if (adInterests.status === "ok") {
            facebookAccount.adInterests = adInterests.data;
        }
    }
}
