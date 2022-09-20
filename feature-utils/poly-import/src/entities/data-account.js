import { ZipFile } from "../storage";
import { runImporter } from "../importer";

export default class DataAccount {
    constructor({ importers, zipData, pod, dataGroups }) {
        this.importingReports = [];
        this.importedFileNames = [];
        this.analyses = {};
        this.reports = {};
        this.analysesExecutionResults = [];
        this.importers = importers;
        this.zipFile = ZipFile.createWithCache(zipData, pod);
        this.pod = pod;
        this._dataGroupsCallback = dataGroups;
    }

    async import() {
        for (let [attr, importerClass] of Object.entries(this.importers)) {
            let { result, report } = await runImporter({
                importerClass,
                zipFile: await this.zipFile,
                pod: this.pod,
                //account is kept in here for now so we can support the old importer structure
                account: this,
            });
            this.importingReports.push(report);
            if (result) this[attr] = result;
        }
        return this;
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
    }

    //This is a relict where this was part of the child facebookAccount
    //Has to stay here for now as its used by the common dataBubbleAnalysis
    //TODO: get rid of this - implement it differently
    //View imformation should not be part of the model
    get dataGroups() {
        return this._dataGroupsCallback(this);
    }
}
