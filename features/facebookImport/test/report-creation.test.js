import { zipFileWithOffFacebookEvents } from "./datasets/off-facebook-events-data";
import {
    getReportStories,
    runAnalysesForZip,
} from "./utils/analyses-execution";
import { expectActiveAnalysis } from "./utils/analysis-assertions";

export const NUMBER_OF_REPORT_ANALYSES = 6;

describe("Report creation for export", () => {
    let computedReportStories = null;
    let facebookAccount = null;
    let jsonReport = null;

    beforeAll(async () => {
        let zipFile = zipFileWithOffFacebookEvents();
        zipFile.addJsonEntry("unknow_folder/unknown_file.json", '""');
        facebookAccount = await runAnalysesForZip(zipFile);
        computedReportStories = getReportStories(facebookAccount);
        jsonReport = computedReportStories.jsonReport;
    });

    it("is report", async () => {
        expectActiveAnalysis(computedReportStories);
    });

    it("has correct number of report analysis", async () => {
        expect(computedReportStories.activeStories.length).toBe(
            NUMBER_OF_REPORT_ANALYSES
        );
    });

    it("has correct number of analysis in JSON report", async () => {
        expect(jsonReport.reportAnalyses_v2.length).toBe(
            NUMBER_OF_REPORT_ANALYSES
        );
    });
});
