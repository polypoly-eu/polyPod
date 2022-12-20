import DirectKeyDataImporter from "./direct-key-data-importer.js";
import { Status, statusTypes } from "@polypoly-eu/poly-import";

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

    async import({ zipFile }) {
        const response = await super.import({ zipFile });
        if (!response) return;

        const rawData = response.result;
        let unknownKeys = new Set();
        // TODO: expand this check; The current one is just a toy example
        for (const companyRawData of rawData) {
            for (const eventRawData of companyRawData.events) {
                const unexpectedKeys = Object.keys(eventRawData).filter(
                    (each) => !OffFacebookEventFields.includes(each)
                );
                for (const unexpectedKey of unexpectedKeys) {
                    unknownKeys.add(unexpectedKey);
                }
            }
        }

        if (unknownKeys.size > 0) {
            return {
                ...response,
                status: new Status({
                    name: statusTypes.warning,
                    message: `Unexpected keys: ${Array.from(unknownKeys).join(
                        " "
                    )}`,
                }),
            };
        }
        return response;
    }
}

OffFacebookEventsImporter.STORAGE_KEY = "offFacebookCompanies";
