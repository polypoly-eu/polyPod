import { Status, statusTypes } from "../utils/status";
import { Telemetry } from "../utils/performance-telemetry";

export class Importer {
    async import({ zipFile, dataAccount }) {
        throw new Error(
            `Calling abstract base class with ${zipFile}, ${dataAccount}`
        );
    }
}

class ImporterExecutionReport {
    constructor({ importer, status, executionTime }) {
        this._importer = importer;
        this._status = status || new Status({ name: statusTypes.success });
        this._executionTime = executionTime;
    }

    get importer() {
        return this._importer;
    }

    get status() {
        return this._status;
    }

    get executionTime() {
        return this._executionTime;
    }

    _extractDataFromStatus(status) {
        return {
            name: status.name,
            message: status.message,
        };
    }

    get reportJsonData() {
        return {
            formatVersion: "v2",
            importerName: this.importer.constructor.name,
            executionTime: this.executionTime.toFixed(0),
            status: Array.isArray(this.status)
                ? this.status.map((each) => this._extractDataFromStatus(each))
                : this._extractDataFromStatus(this.status),
        };
    }
}

export async function runImporter({ importerClass, zipFile, pod, account }) {
    const importer = new importerClass();

    const telemetry = new Telemetry();

    try {
        const response = await importer.import({
            zipFile,
            pod,
            //this is to support old importers without needing to change all at once
            //TODO: change all importers so this can go
            account,
            facebookAccount: account,
        });

        //Currently we have to do this check as not all importers return a result even when
        //executing successfully. We can go back to destructuring after all importers have been changed
        return {
            report: new ImporterExecutionReport({
                importer,
                status: response?.status,
                executionTime: telemetry.elapsedTime(),
            }),
            result: response?.result,
            importedFileNames: response?.importedFileNames,
        };
    } catch (error) {
        return {
            report: new ImporterExecutionReport({
                importer,
                status: new Status({ name: statusTypes.error, message: error }),
                executionTime: telemetry.elapsedTime(),
            }),
        };
    }
}

export async function runImporters({ importerClasses, zipFile, account, pod }) {
    return await Promise.all(
        importerClasses.map(async (importerClass) => {
            return runImporter({ importerClass, zipFile, account, pod });
        })
    );
}

//We need this to support the tests for the previous importer model
export async function runOutdatedImporter(
    importerClass,
    zipFile,
    account,
    pod
) {
    const importer = new importerClass();

    const telemetry = new Telemetry();

    try {
        const status = await importer.import({
            zipFile,
            pod,
            //this is to support old importers without needing to change all at once
            //TODO: change all importers so this can go
            account,
            facebookAccount: account,
        });
        return new ImporterExecutionReport({
            importer,
            status,
            executionTime: telemetry.elapsedTime(),
        });
    } catch (error) {
        return new ImporterExecutionReport({
            importer,
            status: new Status({ name: statusTypes.error, message: error }),
            executionTime: telemetry.elapsedTime(),
        });
    }
}

export async function runOutdatedImporters(
    importerClasses,
    zipFile,
    account,
    pod
) {
    return await Promise.all(
        importerClasses.map(async (importerClass) => {
            return runOutdatedImporter(importerClass, zipFile, account, pod);
        })
    );
}
