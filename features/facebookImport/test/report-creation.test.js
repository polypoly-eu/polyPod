import { analyzeZip } from "../src/model/analysis";
import { importZip } from "../src/model/importer";
import { zipFileWithOffFacebookEvents } from "./datasets/off-facebook-events-data";
import { MockerPod } from "./mocks/pod-mock";
import { expectActiveAnalysis } from "./utils/analysis-assertions";

export const NUMBER_OF_REPORT_ANALYSES = 8;

describe("Report creation for empty zip", () => {
    let unrecognizedData = null;
    let jsonReport = null;

    beforeAll(async () => {
        let zipFile = zipFileWithOffFacebookEvents();
        zipFile.addJsonEntry("unknow_folder/unknown_file.json", '""');
        const facebookAccount = await importZip(zipFile);
        ({ unrecognizedData } = await analyzeZip(
            zipFile.enrichedFileData(),
            zipFile,
            facebookAccount,
            new MockerPod()
        ));

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
