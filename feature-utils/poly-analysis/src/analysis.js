class AnalysisExecutionResult {
    constructor({ analysis, status, executionTime }) {
        this._analysis = analysis;
        this._status = status;
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

export { AnalysisExecutionResult };
