export default class DataAccount {
    constructor(fileId) {
        this.importingResults = [];
        this.importedFileNames = [];
        this.name = "";
        this.preferredLanguage = [];
        this.analyses = {};
        this.reports = {};
        this.analysesExecutionResults = [];
        this.id = fileId;
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
