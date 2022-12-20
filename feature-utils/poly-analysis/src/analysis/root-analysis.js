/**
 * Base class for data analyses.
 */
class RootAnalysis {
    /**
     * The unique identifier of the analysis.
     * @type {string}
     */
    get id() {
        return this.constructor.name;
    }

    /**
     * The label of the analysis.
     * @type {string}
     * @deprecated Presumably unused - stories in data importer Features have a
     * label; analyses not really.
     */
    get label() {
        return RootAnalysis.Labels.TECH_DEMO;
    }

    /**
     * Data the analysis wants to include in a missing/unrecognised data report.
     * @type {Object}
     */
    get customReportData() {
        return null;
    }

    /**
     * Analyses the supplied data, exposing the resulting insights.
     *
     * @param enrichedData
     * @param enrichedData.dataAccount - The account object.
     * @param enrichedData.pod - The polyPod API object, e.g. `window.pod`.
     * @param enrichedData.zipData - The original archive file.
     * @param enrichedData.zipFile - The `ZipFile` object wrapping `zipData`.
     * @returns The status of the analysis.
     */
    async analyze({ zipFile, dataAccount }) {
        throw new Error(
            `Calling abstract base class with ${zipFile}, ${dataAccount}`
        );
    }
}

export default RootAnalysis;
