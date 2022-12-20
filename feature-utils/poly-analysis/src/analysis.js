import {
    ZipFile,
    Telemetry,
    Status,
    statusTypes,
} from "@polypoly-eu/poly-import";
import genericAnalyses from "./generic-analyses";

/**
 * The result of running an analysis.
 */
class AnalysisExecutionResult {
    /**
     * Creates a new instance.
     *
     * @param analysis {RootAnalysis} - A reference to the analysis this result
     * belongs to.
     * @param status {Object} - The status of the analysis.
     * @param executionTime {number} - The time it took to run the analysis.
     */
    constructor(analysis, status, executionTime) {
        this.analysis = analysis;
        this.status = status || new Status({ name: statusTypes.success });
        this.executionTime = executionTime;
    }

    get reportJsonData() {
        return {
            analysisName: this.analysis.id,
            executionStatus: {
                name: this.status.name,
                message: this.status.message,
            },
            executionTime: this.executionTime.toFixed(0),
            customData: this.analysis.customReportData,
        };
    }
}

/**
 * Runs the supplied analysis on the supplied data.
 *
 * @param analysisClass {RootAnalysis} - The analysis to use; a subclass of
 * {@link RootAnalysis}.
 * @param enrichedData {Object} - The data passed to the analysis.
 * @returns {AnalysisExecutionResult}
 */
export async function runAnalysis(analysisClass, enrichedData) {
    const subAnalysis = new analysisClass();
    const telemetry = new Telemetry();
    let status;
    try {
        status = await subAnalysis.analyze(enrichedData);
    } catch (error) {
        status = new Status({ name: statusTypes.error, message: error });
    }
    return new AnalysisExecutionResult(
        subAnalysis,
        status,
        telemetry.elapsedTime()
    );
}

/**
 * Runs the supplied analyses against all files within the supplied ZIP archive.
 *
 * @param data
 * @param data.dataAccount - The account object to read data from and store
 * results into.
 * @param data.pod - The polyPod API object, e.g. `window.pod`.
 * @param data.specificAnalyses - The analyses to run, as a list of {@link
 * RootAnalysis} subclasses.
 * @param data.zipData - The original archive file.
 * @param data.zipFile - The `ZipFile` object wrapping `zipData` - call {@link
 * analyzeFile} instead if you don't have one.
 */
export async function analyzeZip({
    zipData,
    zipFile,
    specificAnalyses,
    dataAccount,
    pod,
}) {
    const enrichedData = { ...zipData, zipFile, dataAccount, pod };
    const allAnalyses = [...genericAnalyses, ...specificAnalyses];
    const analysesResults = await Promise.all(
        allAnalyses.map(async (AnalysisClass) => {
            return runAnalysis(AnalysisClass, enrichedData);
        })
    );
    dataAccount.analysesExecutionResults = analysesResults;
}

/**
 * Runs the supplied analyses against all files within the supplied ZIP data.
 *
 * @param data
 * @param data.dataAccount - The account object to read data from and store
 * results into.
 * @param data.specificAnalyses - The analyses to run, as a list of {@link
 * RootAnalysis} subclasses.
 * @param data.zipData - The original archive file.
 * @todo Unlike {@link analyzeZip}, this hard codes `window.pod` as the way to
 * access the polyPod API object.
 */
export async function analyzeFile({ zipData, dataAccount, specificAnalyses }) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return await analyzeZip({
        zipData,
        zipFile,
        specificAnalyses,
        dataAccount,
        pod: window.pod,
    });
}
