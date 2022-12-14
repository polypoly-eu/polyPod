import RootAnalysis from "../analysis/root-analysis.js";

/**
 * A specialised base class for analyses that extracts insights for
 * missing/unrecognised data reports.
 */
class ReportAnalysis extends RootAnalysis {
    /**
     * @deprecated No idea what this was for, and it doesn't appear to be used.
     */
    get isForDataReport() {
        return true;
    }

    /**
     * The data to include in the report.
     * @type {Object}
     */
    get jsonReport() {
        return {
            id: this.id,
            data: this.reportData,
        };
    }
}

export default ReportAnalysis;
