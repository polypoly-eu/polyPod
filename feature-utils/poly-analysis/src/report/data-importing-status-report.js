import ReportAnalysis from "./report-analysis";

/**
 * An analysis that extracts the JSON report from each data importer.
 */
class DataImportingStatusAnalysis extends ReportAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.reports.importersData = dataAccount.importingReports.map(
            (importerResult) => importerResult.reportJsonData
        );
    }
}

export default DataImportingStatusAnalysis;
