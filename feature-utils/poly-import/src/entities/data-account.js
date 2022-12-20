import { runImporter } from "../importer";

/**
 * Holds imported personal data.
 */
export class DataAccount {
    constructor() {
        /** Execution reports from the import phase. */
        this.importingReports = [];

        /** The names of all files data was imported from. */
        this.importedFileNames = [];

        /** The results of all analyses that ran against the imported data. */
        this.analyses = {};

        /** Reports about unexpected or missing data. */
        this.reports = {};

        /** Execution reports from the analysis phase. */
        this.analysesExecutionResults = [];
    }

    /**
     * Imports data from the supplied ZIP archive.
     * @param importers {Importer[]} - An array of importers to run, where each
     * importer is a class with the same interface as {@link Importer}.
     * @param zipFile {ZipFile} - The ZIP archive to import data from.
     * @param pod - The polyPod API object, e.g. `window.pod`.
     */
    async import({ importers, zipFile, pod }) {
        for (let importerClass of importers) {
            let { result, report } = await runImporter({
                importerClass,
                zipFile,
                pod,
                //account is kept in here for now so we can support the old importer structure
                account: this,
            });
            this.importingReports.push(report);
            for (let name of report?.importedFileNames || [])
                this.addImportedFileName(name);
            if (result) this[importerClass.STORAGE_KEY] = result;
        }
        return this;
    }

    /**
     * Adds a file to the list of imported files.
     * @param fileName - The file name to add.
     */
    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
