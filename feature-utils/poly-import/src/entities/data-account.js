export default class DataAccount {
    constructor() {
        this.importingResults = [];
        this.importedFileNames = [];
        this.name = "";
        this.analyses = {};
        this.reports = {};
        this.analysesExecutionResults = [];
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
