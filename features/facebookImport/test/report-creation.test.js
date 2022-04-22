import {
    MinistoriesStatusReport,
    ReportStories,
} from "@polypoly-eu/poly-analysis";
import ministories from "../src/views/ministories/ministories";
import reports from "../src/views/ministories/reports";
import { zipFileWithOffFacebookEvents } from "./datasets/off-facebook-events-data";
import { runAnalysesForZip } from "./utils/analyses-execution";
import { expectActiveAnalysis } from "./utils/analysis-assertions";

export const NUMBER_OF_REPORT_ANALYSES = 7;

describe("Report creation for export", () => {
    let computedReportStories = null;
    let facebookAccount = null;
    let jsonReport = null;

    beforeAll(async () => {
        let zipFile = zipFileWithOffFacebookEvents();
        zipFile.addJsonEntry("unknow_folder/unknown_file.json", '""');
        facebookAccount = await runAnalysesForZip(zipFile);
        const computedReportStoriesList = reports.map(
            (reportClass) => new reportClass(facebookAccount)
        );

        const computedMinistories = ministories.map(
            (MinistoryClass) => new MinistoryClass(facebookAccount)
        );

        const activeReportStories = computedReportStoriesList.filter(
            (reportStory) => reportStory.active
        );
        const statusReport = new MinistoriesStatusReport([
            ...computedReportStoriesList,
            ...computedMinistories,
        ]);

        computedReportStories = new ReportStories([
            ...activeReportStories,
            statusReport,
        ]);
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
        expect(jsonReport.reportAnalyses_v1.length).toBe(
            NUMBER_OF_REPORT_ANALYSES
        );
    });
});
