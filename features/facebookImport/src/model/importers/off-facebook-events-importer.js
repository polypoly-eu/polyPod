import DirectKeyDataImporter from "./direct-key-data-importer.js";
import { createWarningStatus } from "@polypoly-eu/poly-import";

export const OFF_FACEBOOK_EVENTS_FILE_PATH =
    "apps_and_websites_off_of_facebook/your_off-facebook_activity.json";
export const OFF_FACEBOOK_EVENTS_DATA_KEY = "off_facebook_activity_v2";
export const OFF_FACEBOOK_EVENTS_STORAGE_KEY = "offFacebookCompanies";

const OffFacebookEventFields = ["id", "type", "timestamp"];

export default class OffFacebookEventsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            OFF_FACEBOOK_EVENTS_FILE_PATH,
            OFF_FACEBOOK_EVENTS_DATA_KEY,
            OFF_FACEBOOK_EVENTS_STORAGE_KEY
        );
    }

    async import({ zipFile, facebookAccount }) {
        await super.import({ zipFile, facebookAccount });

        const rawData = facebookAccount.offFacebookCompanies;
        let uknonwnKeys = new Set();
        // TODO: expand this check; The current one is just a toy example
        for (const companyRawData of rawData) {
            for (const eventRawData of companyRawData.events) {
                const unexpectedKeys = Object.keys(eventRawData).filter(
                    (each) => !OffFacebookEventFields.includes(each)
                );
                for (const unexpectedKey of unexpectedKeys) {
                    uknonwnKeys.add(unexpectedKey);
                }
            }
        }

        if (uknonwnKeys.size > 0) {
            return createWarningStatus(
                `Unexpected keys: ${Array.from(uknonwnKeys).join(" ")}`
            );
        }
    }
}
