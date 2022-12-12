import { Status, statusTypes } from "./utils/status";
import { Telemetry } from "./utils/performance-telemetry";

/**
 * Base class for data importers.
 */
export class Importer {
    /**
     * Imports data from the supplied ZIP archive into the supplied account
     * object.
     * @param zipFile - The ZIP archive to read data from.
     * @param dataAccount {DataAccount} - The account to store data in.
     */
    async import({ zipFile, dataAccount }) {
        throw new Error(
            `Calling abstract base class with ${zipFile}, ${dataAccount}`
        );
    }
}

class ImporterExecutionReport {
    constructor({
        importer,
        status,
        statuses,
        executionTime,
        importedFileNames,
    }) {
        this._importer = importer;
        this._status = status || new Status({ name: statusTypes.success });
        this._statuses = statuses;
        this._executionTime = executionTime;
        this._importedFileNames = importedFileNames;
    }

    get importer() {
        return this._importer;
    }

    get status() {
        return this._status;
    }

    get statuses() {
        return this._statuses;
    }

    get executionTime() {
        return this._executionTime;
    }

    get importedFileNames() {
        return this._importedFileNames;
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

/**
 * Runs a single importer on the supplied ZIP archive.
 * @param importerClass {Importer} - The importer to use; a class with the same
 * interface as {@link Importer}.
 * @param zipFile {ZipFile} - The ZIP archive to import data from.
 * @param pod - The polyPod API object, e.g. `window.pod`.
 * @param account {DataAccount} - The account to store data in.
 */
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
                status: response?.report?.status,
                statuses: response?.report?.statuses,
                executionTime: telemetry.elapsedTime(),
                importedFileNames: response?.report?.importedFileNames,
            }),
            result: response?.result,
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

/**
 * Runs multiple importers on the supplied ZIP archive.
 * @param importerClasses {Importer[]} - An array of importers to run, where
 * each importer is a class with the same interface as {@link Importer}.
 * @param zipFile {ZipFile} - The ZIP archive to import data from.
 * @param account {DataAccount} - The account to store data in.
 * @param pod - The polyPod API object, e.g. `window.pod`.
 */
export async function runImporters({ importerClasses, zipFile, account, pod }) {
    return await Promise.all(
        importerClasses.map(async (importerClass) => {
            return runImporter({ importerClass, zipFile, account, pod });
        })
    );
}

/**
 * Like {@link runImporter}, but for the previous importer model.
 * @deprecated
 */
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

/**
 * Like {@link runImporters}, but for the previous importer model.
 * @deprecated
 */
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
