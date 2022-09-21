export default class DataAccount {
    constructor() {
        this.importingResults = [];
        this.importedFileNames = [];
        this.personalData = { name: { givenName: "", familyName: "" } };
        this.preferredLanguage = [];
        this.analyses = {};
        this.reports = {};
        this.analysesExecutionResults = [];
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
