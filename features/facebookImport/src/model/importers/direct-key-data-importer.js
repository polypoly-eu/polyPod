import { readJSONDataArray } from "./utils/importer-util.js";

export default class DirectKeyDataImporter {
    constructor(dataFileName, dataKey, dataStorageKey) {
        this._dataFileName = dataFileName;
        this._dataKey = dataKey;
        this._dataStorageKey = dataStorageKey;
    }

    async import({ zipFile, facebookAccount }) {
        const storedData = await this._loadStoredData?.();
        if (storedData) {
            facebookAccount[this._dataStorageKey] = storedData;
            console.log("used rdf - " + this._dataStorageKey);
            return;
        }
        const extractedData = this.extractData(
            await readJSONDataArray(this._dataFileName, this._dataKey, zipFile)
        );
        facebookAccount[this._dataStorageKey] = extractedData;
        facebookAccount.addImportedFileName(this._dataFileName);
        this._storeData?.(extractedData);
    }

    /**
     * Hook method to allow importers to change the data
     * that gets places into the Facebook Account
     */
    extractData(rawData) {
        return rawData;
    }
}
