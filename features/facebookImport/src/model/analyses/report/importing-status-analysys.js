import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../../analysisKeys";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.analyses[analysisKeys.importersData] =
            dataAccount.importingResults.map(
                (importerResult) => importerResult.reportJsonData
            );
    }
}
