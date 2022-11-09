import { Importer } from "@polypoly-eu/poly-import";
import { readJSONDataArray } from "./utils/importer-util.js";

export default class DirectKeyDataImporter extends Importer {
    constructor(dataFileName, dataKey, dataStorageKey) {
        super();
        this._dataFileName = dataFileName;
        this._dataKey = dataKey;
        this._dataStorageKey = dataStorageKey;
    }

    async import({ zipFile, facebookAccount }) {
        const extractedData = await readJSONDataArray(
            this._dataFileName,
            this._dataKey,
            zipFile
        );

        facebookAccount[this._dataStorageKey] =
            "extractData" in this
                ? this.extractData(extractedData)
                : extractedData;
        facebookAccount.addImportedFileName(this._dataFileName);
    }
}
