import { IMPORT_WARNING } from "../importer-status.js";
import { readJSONDataArray } from "../importer-util.js";

const OffFacebookEventFields = ["id", "type", "timestamp"];

export default class OffFacebookEventsImporter {
    async import({ zipFile }, facebookAccount) {
        const fileName =
            "apps_and_websites_off_of_facebook/your_off-facebook_activity.json";
        const rawData = await readJSONDataArray(
            fileName,
            "off_facebook_activity_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);

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

        facebookAccount.offFacebookCompanies = rawData;
        if (uknonwnKeys.size > 0) {
            return {
                status: IMPORT_WARNING,
                message: `Unexpected keys: ${Array.from(uknonwnKeys).join(
                    " "
                )}`,
                data: { uknonwnKeys },
            };
        }
    }
}
