import {
    ZipFile,
    Telemetry,
    Status,
    statusTypes,
} from "@polypoly-eu/poly-import";
import genericAnalyses from "./generic-analyses";

class AnalysisExecutionResult {
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
