export default class ProcessedData {
    constructor() {
        this._importersData = null;
        this._unknownFolderNames = null;

        this._missingKnownFileNames = null;
        this._missingCommonFileNames = null;

        this._bubblesData = null;
        this._reportMetadata = null;
    }
    findData(key) {
        return this["_" + key];
    }
}
