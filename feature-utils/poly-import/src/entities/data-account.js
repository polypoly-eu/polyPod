import { Telemetry } from "../../utils/performance-telemetry";
import { Status, statusTypes } from "../../utils/status";
import { ZipFile } from "../storage";
import { AnalysisExecutionResult } from "@polypoly-eu/poly-analysis";

export default class DataAccount {
    constructor() {
        this.importedFileNames = [];
        this.importingResults = [];
        this.processedData = [];
        this.name = "";
        this.preferredLanguage = [];
        this.analysesExecutionResults = [];
    }

    addImportedFileName(fileName) {
        this.importedFileNames.push(fileName);
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
            status = await subAnalysis.analyze({
                enrichedData,
                zipFile: enrichedData.zipFile,
                dataAccount: this,
            });
        } catch (error) {
            status = new Status({ name: statusTypes.error, message: error });
        }
        return new AnalysisExecutionResult({
            analysis: subAnalysis,
            executionTime: telemetry.elapsedTime(),
            status: status || new Status({ name: statusTypes.success }),
        });
    }
}
