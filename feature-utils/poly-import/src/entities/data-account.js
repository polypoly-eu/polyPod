export default class DataAccount {
    constructor() {
        this.importedFileNames = [];
        this.importingResults = [];
        this.processedData = [];
        this.name = "";
        this.preferredLanguage = [];
        this.analysesExecutionResults = [];
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
