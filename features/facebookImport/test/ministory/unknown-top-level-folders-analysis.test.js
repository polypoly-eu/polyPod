import UknownTopLevelFoldersAnalysis from "../../src/model/analyses/report/unknown-top-level-folders-analysis";
import { INTERACTED_WITH_ADVERTISERS_FILE_PATH } from "../../src/model/importers/interacted-with-advertisers-importer";
import { OFF_FACEBOOK_EVENTS_FILE_PATH } from "../../src/model/importers/off-facebook-events-importer";
import { createInteractedWithAdvertisersDataset } from "../datasets/interacted-with-advertisers-data";
import { createOffFacebookEventsSimpleData } from "../datasets/off-facebook-events-data";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
} from "../utils/analysis-assertions";
import { createMockedZip } from "../utils/data-creation";

describe("Unknown top level folders analysis", () => {
    let analysis = null;
    let status = null;
    let jsonReport = null;

    beforeAll(async () => {
        let zipFile = createMockedZip([
            [
                OFF_FACEBOOK_EVENTS_FILE_PATH,
                createOffFacebookEventsSimpleData(),
            ],
            [
                INTERACTED_WITH_ADVERTISERS_FILE_PATH,
                createInteractedWithAdvertisersDataset(),
            ],
        ]);
        zipFile.addJsonEntry("unknow_folder/unknown_file.json", '""');
        zipFile.addJsonEntry("another_unknow_folder/file.json", '""');
        zipFile.addTextEntry("unknow_folder_with_text/some_file.txt", '""');
        const { analysisResult } = await runAnalysisForExport(
            UknownTopLevelFoldersAnalysis,
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
        expect(jsonReport.id).toBe(UknownTopLevelFoldersAnalysis.name);
    });

    it("has correct unknow folders in JSON report", async () => {
        expect(jsonReport.data).toStrictEqual([
            "unknow_folder",
            "another_unknow_folder",
            "unknow_folder_with_text",
        ]);
    });
});
