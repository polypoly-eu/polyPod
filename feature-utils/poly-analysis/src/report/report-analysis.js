import RootAnalysis from "../../root-analysis.js";

export default class ReportAnalysis extends RootAnalysis {
    get isForDataReport() {
        return true;
    }

    get jsonReport() {
        return {
            id: this.id,
            data: this.reportData,
        };
    }
}
