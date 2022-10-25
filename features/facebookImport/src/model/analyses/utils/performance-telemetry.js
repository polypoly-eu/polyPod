/**
 * An utility class for measuring time duration.
 * @class Telemetry
 */
export class Telemetry {
    /**
     * Creates a new object with a creation time property set to the current time.
     * @constructor
     * @methodof Telemetry
     */
    constructor() {
        this._creationTime = performance.now();
    }

    /**
     * It returns the time elapsed since the object was created.
     * @returns The difference between the current time and the time the object was created.
     * @methodof Telemetry
     */
    elapsedTime() {
        return performance.now() - this._creationTime;
    }
}
