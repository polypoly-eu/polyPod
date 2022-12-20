/**
 * `Info` allows Features to read information about the polyPod instance they
 * are being executed in.
 */
export interface Info {
    /**
     * @returns The name of the polyPod runtime.
     */
    getRuntime(): Promise<string>;

    /**
     * @returns The version of the polyPod runtime.
     */
    getVersion(): Promise<string>;
}
