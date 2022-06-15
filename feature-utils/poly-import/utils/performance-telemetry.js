/**
 * An utility class for measuring time duration.
 *
 * @class
 */
export class Telemetry {
    constructor() {
        this._creationTime = performance.now();
    }

    elapsedTime() {
        return performance.now() - this._creationTime;
    }
}
