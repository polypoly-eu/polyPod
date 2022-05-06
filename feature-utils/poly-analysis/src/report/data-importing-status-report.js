import ReportAnalysis from "./report-analysis";

export default class DataImportingStatusReport extends ReportAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.reports.importersData = dataAccount.importingResults.map(
            (importerResult) => importerResult.reportJsonData
        );
    }
}
