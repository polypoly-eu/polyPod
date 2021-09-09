import RootAnalysis from "../analyses/root-analysis";

export default class ReportAnalysis extends RootAnalysis {
    get isForDataReport() {
        return true;
    }
}
