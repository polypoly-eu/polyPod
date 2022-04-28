import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    async analyze({ dataAccount }) {
<<<<<<< HEAD
        dataAccount.processedData[analysisKeys.importersData] =
=======
        dataAccount.reports[analysisKeys.importersData] =
>>>>>>> main
            dataAccount.importingResults.map(
                (importerResult) => importerResult.reportJsonData
            );
    }
}
