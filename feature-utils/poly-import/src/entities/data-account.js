import { Telemetry } from "../../utils/performance-telemetry";
import { Status, statusTypes } from "../../utils/status";
import { ZipFile } from "../storage";
import { AnalysisExecutionResult } from "@polypoly-eu/poly-analysis";

export default class DataAccount {
    constructor() {
        this._importingResults = [];
        this._importedFileNames = [];

        this._processedData = [];
        this._name = "";
        this._preferredLanguage = [];
        this._analysesExecutionResults = [];
    }

    get processedData() {
        return this._processedData;
    }

    get importedFileNames() {
        return this._importedFileNames;
    }

    addImportedFileName(fileName) {
        this._importedFileNames.push(fileName);
    }

    get importingResults() {
        return this._importingResults;
    }

    set importingResults(importingResults) {
        this._importingResults = importingResults;
    }

    get analysesExecutionResults() {
        return this._analysesExecutionResults;
    }

    set analysesExecutionResults(analysesExecutionResults) {
        this._analysesExecutionResults = analysesExecutionResults;
    }

    // Basic accessors

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get preferredLanguage() {
        return this._preferredLanguage;
    }

    set preferredLanguage(preferredLanguage) {
        this._preferredLanguage = preferredLanguage;
    }

    async analyzeFile({ zipData, subAnalyses }) {
        const zipFile = await ZipFile.createWithCache(zipData, window.pod);
        return await this.analyzeZip({
            zipData,
            zipFile,
            subAnalyses,
            pod: window.pod,
        });
    }

    async analyzeZip({ zipData, zipFile, subAnalyses, pod }) {
        const enrichedData = { ...zipData, zipFile, dataAccount: this, pod };
        const analysesResults = await Promise.all(
            subAnalyses.map(async (subAnalysisClass) => {
                return this.runAnalysis(subAnalysisClass, enrichedData);
            })
        );
        this.analysesExecutionResults = analysesResults;
    }

    async runAnalysis(analysisClass, enrichedData) {
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
}
