import DirectKeyDataImporter from "./direct-key-data-importer.js";

export default class NameImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            "profile_information/profile_information.json",
            "profile_v2",
            "name"
        );
    }
}
