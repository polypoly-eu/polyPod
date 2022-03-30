import {
    createErrorStatus,
    createSuccessStatus,
} from "../utils/analysis-status";
import { Telemetry } from "../utils/performance-telemetry";

class ImporterExecutionResult {
    constructor(importer, status, executionTime) {
        this._importer = importer;
        this._status = status || createSuccessStatus();
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

export async function runImporter(
    importerClass,
    zipFile,
    facebookAccount,
    pod
) {
    const importer = new importerClass();

    const telemetry = new Telemetry();

    try {
        const status = await importer.import({
            zipFile,
            facebookAccount,
            pod,
        });
        return new ImporterExecutionResult(
            importer,
            status,
            telemetry.elapsedTime()
        );
    } catch (error) {
        return new ImporterExecutionResult(
            importer,
            createErrorStatus(error),
            telemetry.elapsedTime()
        );
    }
}

export async function runImporters(
    importerClasses,
    zipFile,
    facebookAccount,
    pod
) {
    return await Promise.all(
        importerClasses.map(async (importerClass) => {
            return runImporter(importerClass, zipFile, facebookAccount, pod);
        })
    );
}
