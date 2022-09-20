import { Status, statusTypes } from "../utils/status";
import { Telemetry } from "../utils/performance-telemetry";

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
        const { result, status } = await importer.import({
            zipFile,
            pod,
            //this is to support old importers without needing to change all at once
            //TODO: change all importers so this can go
            account,
            facebookAccount: account,
        });
        return {
            report: new ImporterExecutionReport({
                importer,
                status,
                elapsedTime: telemetry.elapsedTime(),
            }),
            result,
        };
    } catch (error) {
        return {
            report: new ImporterExecutionReport({
                importer,
                status: new Status({ name: statusTypes.error, message: error }),
                elapsedTime: telemetry.elapsedTime(),
            }),
        };
    }
}
