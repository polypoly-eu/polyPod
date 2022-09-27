import { runImporter } from "../importer";

export default class DataAccount {
    constructor() {
        this.importingReports = [];
        this.importedFileNames = [];
        this.analyses = {};
        this.reports = {};
        this.analysesExecutionResults = [];
    }

    async import({ importers, zipFile, pod }) {
        for (let importerClass of importers) {
            let { result, report, importedFileNames } = await runImporter({
                importerClass,
                zipFile,
                pod,
                //account is kept in here for now so we can support the old importer structure
                account: this,
            });
            this.importingReports.push(report);
            for (let name of importedFileNames || [])
                this.addImportedFileName(name);
            if (result) this[importerClass.STORAGE_KEY] = result;
        }
        return this;
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
