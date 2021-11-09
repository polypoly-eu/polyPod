import MinistoriesStatusAnalysis from "../../src/model/analyses/report/ministories-status-analysis";
import { NUMBER_OF_ANALYSES } from "../../src/model/analysis";
import { zipFileWithOffFacebookEvents } from "../datasets/off-facebook-events-data";
import { runAnalysesForZip } from "../utils/analyses-execution";
import { expectActiveAnalysis } from "../utils/analysis-assertions";

describe("Ministories status analysis", () => {
    let unrecognizedData = null;
    let ministoriesAnalysis = null;
    let jsonReport = null;

    beforeAll(async () => {
        const zipFile = zipFileWithOffFacebookEvents();
        ({ unrecognizedData } = await runAnalysesForZip(zipFile));

        ministoriesAnalysis = unrecognizedData.reportAnalyses.find(
            (each) => each.constructor === MinistoriesStatusAnalysis
        );
        jsonReport = ministoriesAnalysis.jsonReport;
    });

    it("is active", async () => {
        expectActiveAnalysis(ministoriesAnalysis);
    });

    it("has correct number of importers", async () => {
        expect(jsonReport.data.length).toBe(NUMBER_OF_ANALYSES);
    });
});
