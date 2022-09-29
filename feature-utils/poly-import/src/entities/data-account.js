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
        for (let [attr, importerClass] of Object.entries(importers)) {
<<<<<<< HEAD
            let { result, report, importedFileNames } = await runImporter({
=======
            let { result, report } = await runImporter({
>>>>>>> main
                importerClass,
                zipFile,
                pod,
                //account is kept in here for now so we can support the old importer structure
                account: this,
            });
            this.importingReports.push(report);
<<<<<<< HEAD
            for (let name of importedFileNames || [])
                this.addImportedFileName(name);
=======
>>>>>>> main
            if (result) this[attr] = result;
        }
        return this;
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
