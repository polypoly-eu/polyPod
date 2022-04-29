export default class ProcessedData {
    constructor() {
        this._importersData = null;
        this._unknownFolderNames = null;

        this._missingKnownFileNames = null;
        this._missingCommonFileNames = null;

        this._reportMetadata = null;
    }
    getData(key) {
        return this["_" + key];
    }
}
