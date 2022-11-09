import ReportAnalysis from "./report-analysis";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.reports.importersData = dataAccount.importingReports.map(
            (importerResult) => importerResult.reportJsonData
        );
    }
}
