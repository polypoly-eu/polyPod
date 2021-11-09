import { readJSONDataArray } from "./utils/importer-util.js";

export default class DirectKeyDataImporter {
    constructor(dataFileName, dataKey, dataStorageKey) {
        this._dataFileName = dataFileName;
        this._dataKey = dataKey;
        this._dataStorageKey = dataStorageKey;
    }

    async import({ zipFile, facebookAccount }) {
        facebookAccount[this._dataStorageKey] = this.extractData(
            await readJSONDataArray(this._dataFileName, this._dataKey, zipFile)
        );
        facebookAccount.addImportedFileName(this._dataFileName);
    }

    /**
     * Hook method to allow importers to change the data
     * that gets places into the Facebook Account
     */
    extractData(rawData) {
        return rawData;
    }
}
