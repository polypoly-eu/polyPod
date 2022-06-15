import ReportMetadataAnalysis from "../../src/model/analyses/report/report-metadata";
import analysisKeys from "../../src/model/analyses/utils/analysisKeys";
import { INTERACTED_WITH_ADVERTISERS_FILE_PATH } from "../../src/model/importers/interacted-with-advertisers-importer";
import { LANGUAGE_AND_LOCALE_FILE_PATH } from "../../src/model/importers/language-and-locale-importer";
import { OFF_FACEBOOK_EVENTS_FILE_PATH } from "../../src/model/importers/off-facebook-events-importer";
import ReportMetadataReport from "../../src/views/ministories/reportMetadata";
import { createInteractedWithAdvertisersDataset } from "../datasets/interacted-with-advertisers-data";
import { createLanguageSettingsData } from "../datasets/language-and-locale-data";
import { createOffFacebookEventsSimpleData } from "../datasets/off-facebook-events-data";
import {
    MOCKED_POD_RUNTIME,
    MOCKED_POD_RUNTIME_VERSION,
} from "../mocks/pod-mock";
import { MINIMUM_FILE_SIZE } from "../mocks/zipfile-mock";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
} from "../utils/analysis-assertions";
import { createMockedZip } from "../utils/data-creation";

describe("Report metadata analysis", () => {
    const preferedLanguage = {
        code: "en_US",
        name: "Selected Language",
    };
    let reportData = null;
    let analysisReport = null;
    let status = null;
    let jsonReport = null;

    beforeAll(async () => {
        const zipFile = createMockedZip([
            [
                OFF_FACEBOOK_EVENTS_FILE_PATH,
                createOffFacebookEventsSimpleData(),
            ],
            [
                INTERACTED_WITH_ADVERTISERS_FILE_PATH,
                createInteractedWithAdvertisersDataset(),
            ],
            [
                LANGUAGE_AND_LOCALE_FILE_PATH,
                createLanguageSettingsData(
                    preferedLanguage.code,
                    "de_DE",
                    "en"
                ),
            ],
        ]);
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            ReportMetadataAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisReport = new ReportMetadataReport({ account: facebookAccount });
        jsonReport = analysisReport.jsonReport;
        reportData = getReportData(analysisReport);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisReport);
    });

    it("has id in JSON report", async () => {
        expect(jsonReport.id).toBe(
            getReportNameFromAnalaysis(ReportMetadataAnalysis)
        );
    });

    it("has correct file size in analysis", async () => {
        expect(reportData.fileSize).toBe(MINIMUM_FILE_SIZE);
    });

    it("has correct file size in JSON report", async () => {
        expect(jsonReport.data.fileSize).toBe(MINIMUM_FILE_SIZE);
    });

    it("has correct files count in analysis", async () => {
        expect(reportData.filesCount).toBe(3);
    });

    it("has correct files count in JSON report", async () => {
        expect(jsonReport.data.filesCount).toBe(3);
    });

    it("has correct prefered language in analysis", async () => {
        expect(reportData.preferedLanguage).toStrictEqual(preferedLanguage);
    });

    it("has correct prefered ,anguage in JSON report", async () => {
        expect(jsonReport.data.preferedLanguage).toStrictEqual(
            preferedLanguage
        );
    });

    it("has correct polyPod version in analysis", async () => {
        expect(reportData.polyPodVersion).toBe(MOCKED_POD_RUNTIME_VERSION);
    });

    it("has correct polyPod version in JSON report", async () => {
        expect(jsonReport.data.polyPodVersion).toBe(MOCKED_POD_RUNTIME_VERSION);
    });

    it("has correct polyPod runtime in analysis", async () => {
        expect(reportData.polyPodRuntime).toBe(MOCKED_POD_RUNTIME);
    });

    it("has correct polyPod runtime in JSON report", async () => {
        expect(jsonReport.data.polyPodRuntime).toBe(MOCKED_POD_RUNTIME);
    });
});

function getReportNameFromAnalaysis(analysis) {
    return analysis.name.replace("Analysis", "Report");
}

function getReportData(analysisReport) {
    const analysisData = analysisReport.reports[analysisKeys.reportMetadata];
    return { ...analysisData };
}
