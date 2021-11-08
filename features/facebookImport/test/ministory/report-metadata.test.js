import ReportMetadataAnalysis from "../../src/model/analyses/report/report-metadata";
import { INTERACTED_WITH_ADVERTISERS_FILE_PATH } from "../../src/model/importers/interacted-with-advertisers-importer";
import { LANGUAGE_AND_LOCALE_FILE_PATH } from "../../src/model/importers/language-and-locale-importer";
import { OFF_FACEBOOK_EVENTS_FILE_PATH } from "../../src/model/importers/off-facebook-events-importer";
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
    let analysis = null;
    let status = null;
    let jsonReport = null;

    beforeAll(async () => {
        // Create a zip with two json files.
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
        const { analysisResult } = await runAnalysisForExport(
            ReportMetadataAnalysis,
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
        expect(jsonReport.id).toBe(ReportMetadataAnalysis.name);
    });

    it("has correct file size in analysis", async () => {
        expect(analysis._size).toBe(MINIMUM_FILE_SIZE);
    });

    it("has correct file size in JSON report", async () => {
        expect(jsonReport.data.fileSize).toBe(MINIMUM_FILE_SIZE);
    });

    it("has correct files count in analysis", async () => {
        expect(analysis._filesCount).toBe(3);
    });

    it("has correct files count in JSON report", async () => {
        expect(jsonReport.data.filesCount).toBe(3);
    });

    it("has correct prefered language in analysis", async () => {
        expect(analysis._preferedLanguage).toStrictEqual(preferedLanguage);
    });

    it("has correct prefered ,anguage in JSON report", async () => {
        expect(jsonReport.data.preferedLanguage).toStrictEqual(
            preferedLanguage
        );
    });

    it("has correct polyPod version in analysis", async () => {
        expect(analysis._polyPodVersion).toBe(MOCKED_POD_RUNTIME_VERSION);
    });

    it("has correct polyPod version in JSON report", async () => {
        expect(jsonReport.data.polyPodVersion).toBe(MOCKED_POD_RUNTIME_VERSION);
    });

    it("has correct polyPod runtime in analysis", async () => {
        expect(analysis._polyPodRuntime).toBe(MOCKED_POD_RUNTIME);
    });

    it("has correct polyPod runtime in JSON report", async () => {
        expect(jsonReport.data.polyPodRuntime).toBe(MOCKED_POD_RUNTIME);
    });
});
