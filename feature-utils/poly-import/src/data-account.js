import ProcessedData from "./processed-data";

export default class DataAccount {
    constructor() {
<<<<<<< HEAD:feature-utils/poly-import/src/entities/data-account.js
        this.importedFileNames = [];
        this.importingResults = [];
        this.processedData = [];
        this.name = "";
        this.preferredLanguage = [];
        this.analysesExecutionResults = [];
=======
        this._importingResults = [];
        this._importedFileNames = [];

        this._name = "";
        this._preferredLanguage = [];
        this._processedData = new ProcessedData();
        this._analysesExecutionResults = [];
    }

    get processedData() {
        return this._processedData;
    }

    get importedFileNames() {
        return this._importedFileNames;
>>>>>>> parent of aaaa65c6a (tests working with processed data):feature-utils/poly-import/src/data-account.js
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
