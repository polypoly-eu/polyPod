import { zipFileWithOffFacebookEvents } from "./datasets/off-facebook-events-data";
import { runAnalysesForZip } from "./utils/analyses-execution";
import { expectActiveAnalysis } from "./utils/analysis-assertions";

export const NUMBER_OF_REPORT_ANALYSES = 8;

describe("Report creation for empty zip", () => {
    let unrecognizedData = null;
    let jsonReport = null;

    beforeAll(async () => {
        let zipFile = zipFileWithOffFacebookEvents();
        zipFile.addJsonEntry("unknow_folder/unknown_file.json", '""');
        ({ unrecognizedData } = await runAnalysesForZip(zipFile));

        jsonReport = unrecognizedData.jsonReport;
    });

    it("is report", async () => {
        expectActiveAnalysis(unrecognizedData);
    });

    it("has correct number of report analysis", async () => {
        expect(unrecognizedData.reportAnalyses.length).toBe(
            NUMBER_OF_REPORT_ANALYSES
        );
    });

    it("has correct number of analysis in JSON report", async () => {
        expect(jsonReport.reportAnalyses_v1.length).toBe(
            NUMBER_OF_REPORT_ANALYSES
        );
    });
});
