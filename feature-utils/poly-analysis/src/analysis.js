import { Telemetry } from "../utils/performance-telemetry.js";
import { createErrorStatus, createSuccessStatus } from "../utils/status.js";

import InactiveCardsSummary from "./analysis/report/inactive-cards-summary.js";

import MinistoriesStatusAnalysis from "./analysis/report/ministories-status-analysis.js";

export class UnrecognizedData {
    constructor(analysesResults) {
        this._activeReportAnalyses = analysesResults
            .filter(
                ({ analysis, status }) =>
                    status.isSuccess &&
                    analysis.isForDataReport &&
                    analysis.active
            )
            .map(({ analysis }) => analysis);

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
    constructor(analysis, status, executionTime) {
        this._analysis = analysis;
        this._status = status || createSuccessStatus();
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
        const status = await subAnalysis.analyze(enrichedData);
        return new AnalysisExecutionResult(
            subAnalysis,
            status,
            telemetry.elapsedTime()
        );
    } catch (error) {
        return new AnalysisExecutionResult(
            subAnalysis,
            createErrorStatus(error),
            telemetry.elapsedTime()
        );
    }
}
