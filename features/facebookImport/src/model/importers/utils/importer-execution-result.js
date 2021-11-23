import { ExecutionResult } from "./execution-result";

export default class ImporterExecutionResult extends ExecutionResult {
    constructor(importer, status, executionTime) {
        super(status, executionTime);
        this._importer = importer;
    }

    get importer() {
        return this._importer;
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
