import DataImportingStatusAnalysis from "../../src/model/analyses/report/importing-status-analysis";
import { NUMBER_OF_IMPORTERS } from "../../src/model/importer";
import DataImportingStatusReport from "../../src/views/ministories/dataImportingStatus";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
} from "../utils/analysis-assertions";
import { createMockedZip } from "../utils/data-creation";

describe("Importing status analysis for empty zip", () => {
    let analysisReport = null;
    let status = null;
    let jsonReport = null;

    beforeAll(async () => {
        const zipFile = createMockedZip([]);
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            DataImportingStatusAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisReport = new DataImportingStatusReport(facebookAccount);
        jsonReport = analysisReport.jsonReport;
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisReport);
    });

    it("has id in JSON report", async () => {
        expect(jsonReport.id).toBe(
            getReportNameFromAnalaysis(DataImportingStatusAnalysis)
        );
    });

    it("has correct number of importers", async () => {
        expect(jsonReport.data.length).toBe(NUMBER_OF_IMPORTERS);
    });
});

function getReportNameFromAnalaysis(analysis) {
    return analysis.name.replace("Analysis", "Report");
}
