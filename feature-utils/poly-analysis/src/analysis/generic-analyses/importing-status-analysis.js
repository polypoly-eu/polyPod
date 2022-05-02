import ReportAnalysis from "../report/report-analysis";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.processedData._importersData =
            dataAccount.importingResults.map(
                (importerResult) => importerResult.reportJsonData
            );
    }
}
