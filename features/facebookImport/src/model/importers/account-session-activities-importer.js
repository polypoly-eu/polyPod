import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class AccountSessionActivitiesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "security_and_login_information/account_activity.json",
            "account_activity_v2",
            "accountSessionActivities"
        );
    }
}
