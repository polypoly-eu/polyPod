import { readJSONDataArray } from "./../../model/analysis-util.js";

export default class OffFacebookEventsImporter {
    async import({ zipFile, facebookAccount }) {
        const offFacebookCompanies = await readJSONDataArray(
            "apps_and_websites_off_of_facebook/your_off-facebook_activity.json",
            "off_facebook_activity_v2",
            zipFile
        );
        if (offFacebookCompanies.status === "ok") {
            facebookAccount.offFacebookCompanies = offFacebookCompanies.data;
        }
    }
}
