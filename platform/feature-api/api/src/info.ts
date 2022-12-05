/**
 * `Info` allows the Feature to read information about
 * the polyPod instance it is being executed in.
 */
export interface Info {
    /**
     * A way for features to read the polyPod runtime identification
     * @returns {string} The runtime name as a string.
     */
    getRuntime(): Promise<string>;

    /**
     * A way for features to read the user visible polyPod version
     * @returns {string} A string of the version number.
     */
    getVersion(): Promise<string>;
}
