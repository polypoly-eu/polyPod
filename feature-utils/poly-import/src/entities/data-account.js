import { ZipFile } from "../storage";
import { runImporter } from "../importer";

export default class DataAccount {
    constructor({ importers, zipData, pod }) {
        this.importingReports = [];
        this.importedFileNames = [];
        this.analyses = {};
        this.reports = {};
        this.analysesExecutionResults = [];
        this.zipFile = ZipFile.createWithCache(zipData, pod);
        let self = this;
        Object.entries(importers).forEach(([attr, importerClass]) => {
            Object.defineProperty(self, attr, {
                get: function () {
                    return (async (self, attr) => {
                        debugger;
                        if (self[`${attr}_stored`])
                            return self[`${attr}_stored`];

                        const { report, result } = await runImporter({
                            importerClass,
                            zipFile: await self.zipFile,
                            pod,
                        });
                        self.importingReports.push(report);
                        self[`${attr}_stored`] = result;
                        return result;
                    })(self, attr);
                },
            });
        });
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }
}
