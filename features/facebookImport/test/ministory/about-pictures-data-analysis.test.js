import AboutPicturesDataAnalysis from "../../src/model/analyses/ministories/about-pictures-data-analysis";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectInactiveAnalysis,
    expectAnalysisSuccessStatus,
    expectActiveAnalysis,
} from "../utils/analysis-assertions";

describe("Pictures ministory on export with no JPEG pictures in correct locations", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        zipFile.addNamedEntry("photos_and_videos/emptyalbum.png", "");
        zipFile.addNamedEntry(
            "messages/inbox/user_2j57v4wtoa/photos/14567839_1208576379157271_232556476_n_21487783899157271.jpg",
            ""
        );
        const { analysisResult } = await runAnalysisForExport(
            AboutPicturesDataAnalysis,
            zipFile
        );
        ({ analysis, status } = analysisResult);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysis);
    });
});

describe("Pictures ministory on export with JPEG pictures in correct location", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        zipFile.addNamedEntry(
            "photos_and_videos/TimelinePhotos_24T6AJAQ42/14567839_1208576379157271_232556476_n_21487783899157271.jpg",
            ""
        );

        const { analysisResult } = await runAnalysisForExport(
            AboutPicturesDataAnalysis,
            zipFile
        );
        ({ analysis, status } = analysisResult);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysis);
    });
});
