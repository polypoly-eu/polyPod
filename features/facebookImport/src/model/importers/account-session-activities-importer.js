import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const SESSION_ACTIVITIES_FILE_PATH =
    "security_and_login_information/account_activity.json";
export const SESSION_ACTIVITIES_DATA_KEY = "account_activity_v2";
export const SESSION_ACTIVITIES_STORAGE_KEY = "accountSessionActivities";

export default class AccountSessionActivitiesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            SESSION_ACTIVITIES_FILE_PATH,
            SESSION_ACTIVITIES_DATA_KEY,
            SESSION_ACTIVITIES_STORAGE_KEY
        );
    }
}
