import { IMPORT_WARNING } from "../importer-status.js";
import DirectKeyDataImporter from "./direct-key-data-importer.js";

const OffFacebookEventFields = ["id", "type", "timestamp"];

export default class OffFacebookEventsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "apps_and_websites_off_of_facebook/your_off-facebook_activity.json",
            "off_facebook_activity_v2",
            "offFacebookCompanies"
        );
    }

    async import({ zipFile }, facebookAccount) {
        await super.import({ zipFile }, facebookAccount);

        const rawData = facebookAccount.offFacebookCompanies;
        let uknonwnKeys = new Set();
        // TODO: expand this check; The current one is just a toy example
        for (const companyRawData of rawData) {
            for (const eventRawData of companyRawData?.events) {
                const unexpectedKeys = Object.keys(eventRawData).filter(
                    (each) => !OffFacebookEventFields.includes(each)
                );
                for (const unexpectedKey of unexpectedKeys) {
                    uknonwnKeys.add(unexpectedKey);
                }
            }
        }

        if (uknonwnKeys.size > 0) {
            return {
                status: IMPORT_WARNING,
                importerClass: OffFacebookEventsImporter,
                message: `Unexpected keys: ${Array.from(uknonwnKeys).join(
                    " "
                )}`,
                data: { uknonwnKeys },
            };
        }
    }
}
