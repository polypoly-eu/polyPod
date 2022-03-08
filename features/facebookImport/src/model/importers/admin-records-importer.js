import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const ADMIN_RECORDS_FILE_PATH =
    "security_and_login_information/record_details.json";
export const ADMIN_RECORDS_DATA_KEY = "admin_records_v2";
export const ADMIN_RECORDS_STORAGE_KEY = "adminRecords";

export default class AdminRecordsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            ADMIN_RECORDS_FILE_PATH,
            ADMIN_RECORDS_DATA_KEY,
            ADMIN_RECORDS_STORAGE_KEY
        );
    }
}
