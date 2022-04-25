export default class DataAccount {
    constructor() {
        this._importingResults = [];
        this._importedFileNames = [];

        this._name = "";
        this._preferredLanguage = [];
        this._analyses = {};
        this._reports = {};
        this._analysesExecutionResults = [];
    }

    get analyses() {
        return this._analyses;
    }

    get reports() {
        return this._reports;
    }

    get importedFileNames() {
        return this._importedFileNames;
    }

    addImportedFileName(fileName) {
        this._importedFileNames.push(fileName);
    }

    get importingResults() {
        return this._importingResults;
    }

    set importingResults(importingResults) {
        this._importingResults = importingResults;
    }

    get analysesExecutionResults() {
        return this._analysesExecutionResults;
    }

    set analysesExecutionResults(analysesExecutionResults) {
        this._analysesExecutionResults = analysesExecutionResults;
    }

    // Basic accessors

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get preferredLanguage() {
        return this._preferredLanguage;
    }

    set preferredLanguage(preferredLanguage) {
        this._preferredLanguage = preferredLanguage;
    }
}
