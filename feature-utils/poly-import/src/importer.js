import { Status, statusTypes } from "../utils/status";
import { Telemetry } from "../utils/performance-telemetry";
import { ZipFile } from "./storage";

export class Importer {
    async import({ zipFile, dataAccount }) {
        throw new Error(
            `Calling abstract base class with ${zipFile}, ${dataAccount}`
        );
    }
}

class ImporterExecutionResult {
    constructor(importer, status, executionTime) {
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

export async function runImporter(importerClass, zipFile, facebookAccount) {
    const importer = new importerClass();

    const telemetry = new Telemetry();

    try {
        const status = await importer.import({
            zipFile,
            facebookAccount,
        });
        return new ImporterExecutionResult(
            importer,
            status,
            telemetry.elapsedTime()
        );
    } catch (error) {
        return new ImporterExecutionResult(
            importer,
            new Status({ name: statusTypes.error, message: error }),
            telemetry.elapsedTime()
        );
    }
}

export async function runImporters(importerClasses, zipFile, dataAccount) {
    return await Promise.all(
        importerClasses.map(async (importerClass) => {
            return runImporter(importerClass, zipFile, dataAccount);
        })
    );
}

export async function importZip({ dataImporters, zipFile, DataAccount }) {
    const dataAccount = new DataAccount();
    const importingResults = await runImporters(
        dataImporters,
        zipFile,
        dataAccount
    );

    dataAccount.importingResults = importingResults;

    return dataAccount;
}

export async function importData({ dataImporters, zipData, DataAccount }) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return importZip({ dataImporters, zipFile, DataAccount });
}
