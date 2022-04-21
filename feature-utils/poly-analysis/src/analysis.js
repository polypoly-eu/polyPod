import {
    ZipFile,
    Telemetry,
    Status,
    statusTypes,
} from "@polypoly-eu/poly-import";
import InactiveCardsSummary from "./analysis/report/inactive-cards-summary.js";

import MinistoriesStatusAnalysis from "./analysis/report/ministories-status-analysis.js";

export class UnrecognizedData {
    constructor(analysesResults) {
        this._activeReportAnalyses = [];
        const inactiveCardsSummary = new InactiveCardsSummary(analysesResults);
        if (inactiveCardsSummary.active) {
            this._activeReportAnalyses.push(inactiveCardsSummary);
        }

        const statusAnalysis = new MinistoriesStatusAnalysis(analysesResults);
        if (statusAnalysis.active) {
            this._activeReportAnalyses.push(statusAnalysis);
        }

        this.active = this._activeReportAnalyses.length > 0;
    }

    get reportAnalyses() {
        return this._activeReportAnalyses;
    }

    get report() {
        if (!this.active) {
            return "No data to report!";
        }
        return (
            this.reportAnalyses.length +
            " " +
            (this.reportAnalyses.length > 0 ? "analyses" : "analysis") +
            "  included in the report"
        );
    }

    get jsonReport() {
        if (!this.active) {
            return {};
        }

        const reportAnalyses = this.reportAnalyses.map(
            (analysis) => analysis.jsonReport
        );

        return { reportAnalyses_v1: reportAnalyses };
    }
}

class AnalysisExecutionResult {
    constructor(analysis, active, status, executionTime) {
        this._analysis = analysis;
        this._active = active;
        this._status = status || new Status({ name: statusTypes.success });
        this._executionTime = executionTime;
    }

    get analysis() {
        return this._analysis;
    }

    get status() {
        return this._status;
    }

    get active() {
        return this._active;
    }

    get executionTime() {
        return this._executionTime;
    }

    get reportJsonData() {
        return {
            analysisName: this.analysis.id,
            activationStatus: this.analysis.active ? "ACTIVE" : "INACTIVE",
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
    try {
        const { status, active } = await subAnalysis.analyze(enrichedData);
        return new AnalysisExecutionResult(
            subAnalysis,
            active,
            status,
            telemetry.elapsedTime()
        );
    } catch (error) {
        return new AnalysisExecutionResult(
            subAnalysis,
            false,
            new Status({ name: statusTypes.error, message: error }),
            telemetry.elapsedTime()
        );
    }
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

    // const successfullyExecutedAnalyses = analysesResults
    //     .filter(({ status }) => status.isSuccess)
    //     .map(({ analysis }) => analysis);
    // const activeGlobalAnalyses = successfullyExecutedAnalyses.filter(
    //     (analysis) => !analysis.isForDataReport && analysis.active
    // );

    dataAccount.unrecognizedData = new UnrecognizedData(analysesResults);
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
