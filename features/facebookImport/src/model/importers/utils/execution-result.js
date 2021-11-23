import { createSuccessStatus } from "../../analyses/utils/analysis-status";
import {
    fromJsonObject,
    toJsonObject,
} from "../../entities/utils/json-serialization";

export class ExecutionResult {
    constructor(status, executionTime) {
        this._status = status || createSuccessStatus();
        this._executionTime = executionTime;
    }

    get status() {
        return this._status;
    }

    get executionTime() {
        return this._executionTime;
    }

    toJSON() {
        return toJsonObject(this);
    }

    static fromJSON(jsonObject) {
        return fromJsonObject(jsonObject, this);
    }
}
