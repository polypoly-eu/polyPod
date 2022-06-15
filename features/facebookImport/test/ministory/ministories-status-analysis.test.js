import { MinistoriesStatusReport } from "@polypoly-eu/poly-analysis";
import { NUMBER_OF_MINISTORIES } from "../../src/views/ministories/ministories";
import { NUMBER_OF_REPORTS } from "../../src/views/ministories/reports";
import { zipFileWithOffFacebookEvents } from "../datasets/off-facebook-events-data";
import {
    getReportStories,
    runAnalysesForZip,
} from "../utils/analyses-execution";
import { expectActiveAnalysis } from "../utils/analysis-assertions";

describe("Ministories status analysis", () => {
    let ministoriesAnalysis = null;
    let jsonReport = null;

    beforeAll(async () => {
        const zipFile = zipFileWithOffFacebookEvents();
        const facebookAccount = await runAnalysesForZip(zipFile);

        const reportStories = getReportStories(facebookAccount);

        ministoriesAnalysis = reportStories.activeStories.find(
            (each) => each.constructor === MinistoriesStatusReport
        );
        jsonReport = ministoriesAnalysis.jsonReport;
    });

    it("is active", async () => {
        expectActiveAnalysis(ministoriesAnalysis);
    });

    it("has correct number of importers", async () => {
        expect(jsonReport.data.length).toBe(
            NUMBER_OF_MINISTORIES + NUMBER_OF_REPORTS
        );
    });
});
