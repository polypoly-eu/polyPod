import {
    ZipFile,
    Telemetry,
    Status,
    statusTypes,
} from "@polypoly-eu/poly-import";

class AnalysisExecutionResult {
    constructor(analysis, status, executionTime) {
        this._analysis = analysis;
        this._status = status || new Status({ name: statusTypes.success });
        this._executionTime = executionTime;
    }

    get analysis() {
        return this._analysis;
    }

    get status() {
        return this._status;
    }

    get executionTime() {
        return this._executionTime;
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
    subAnalyses,
    dataAccount,
    pod,
}) {
    const enrichedData = { ...zipData, zipFile, dataAccount, pod };
    const analysesResults = await Promise.all(
        subAnalyses.map(async (subAnalysisClass) => {
            return runAnalysis(subAnalysisClass, enrichedData);
        })
    );
    dataAccount.analysesExecutionResults = analysesResults;
}

export async function analyzeFile({ zipData, dataAccount, subAnalyses }) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return await analyzeZip({
        zipData,
        zipFile,
        subAnalyses,
        dataAccount,
        pod: window.pod,
    });
}
