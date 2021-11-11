import DataImportingStatusAnalysis from "../../src/model/analyses/report/importing-status-analysys";
import { NUMBER_OF_IMPORTERS } from "../../src/model/importer";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
} from "../utils/analysis-assertions";
import { createMockedZip } from "../utils/data-creation";

describe("Importing status analysis for empty zip", () => {
    let analysis = null;
    let status = null;
    let jsonReport = null;

    beforeAll(async () => {
        const zipFile = createMockedZip([]);
        const { analysisResult } = await runAnalysisForExport(
            DataImportingStatusAnalysis,
            zipFile
        );
        ({ analysis, status } = analysisResult);
        jsonReport = analysis.jsonReport;
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysis);
    });

    it("has id in JSON report", async () => {
        expect(jsonReport.id).toBe(DataImportingStatusAnalysis.name);
    });

    it("has correct number of importers", async () => {
        expect(jsonReport.data.length).toBe(NUMBER_OF_IMPORTERS);
    });
});
