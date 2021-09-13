import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class AdminRecordsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "security_and_login_information/record_details.json",
            "admin_records_v2",
            "adminRecords"
        );
    }
}
