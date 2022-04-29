import UnknownTopLevelFoldersAnalysis from "../../src/model/analyses/report/unknown-top-level-folders-analysis";
import { INTERACTED_WITH_ADVERTISERS_FILE_PATH } from "../../src/model/importers/interacted-with-advertisers-importer";
import { OFF_FACEBOOK_EVENTS_FILE_PATH } from "../../src/model/importers/off-facebook-events-importer";
import UnknownTopLevelFoldersReport from "../../src/views/ministories/unknownTopLevelFolders";
import { createInteractedWithAdvertisersDataset } from "../datasets/interacted-with-advertisers-data";
import { createOffFacebookEventsSimpleData } from "../datasets/off-facebook-events-data";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
} from "../utils/analysis-assertions";
import { createMockedZip } from "../utils/data-creation";

describe("Unknown top level folders analysis", () => {
    let analysisReport = null;
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
        zipFile.addJsonEntry("unknown_folder/unknown_file.json", '""');
        zipFile.addJsonEntry("another_unknown_folder/file.json", '""');
        zipFile.addTextEntry("unknown_folder_with_text/some_file.txt", '""');
        const { analysisResult, facebookAccount } = await runAnalysisForExport(
            UnknownTopLevelFoldersAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisReport = new UnknownTopLevelFoldersReport(facebookAccount);
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
            getReportNameFromAnalaysis(UnknownTopLevelFoldersAnalysis)
        );
    });

    it("has correct unknown folders in JSON report", async () => {
        expect(jsonReport.data).toStrictEqual([
            "unknown_folder",
            "another_unknown_folder",
            "unknown_folder_with_text",
        ]);
    });
});

function getReportNameFromAnalaysis(analysis) {
    return analysis.name.replace("Analysis", "Report");
}
