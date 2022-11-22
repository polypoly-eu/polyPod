import AboutPicturesDataAnalysis from "../../src/model/analyses/ministories/about-pictures-data-analysis";
import AboutPicturesMinistory from "../../src/views/ministories/aboutPictures";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectInactiveAnalysis,
    expectAnalysisSuccessStatus,
    expectActiveAnalysis,
} from "../utils/analysis-assertions";

describe("Pictures ministory on export with no JPEG pictures in correct locations", () => {
    let analysisStory = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        zipFile.addNamedEntry("photos_and_videos/emptyalbum.png", "");
        zipFile.addNamedEntry(
            "messages/inbox/user_2j57v4wtoa/photos/14567839_1208576379157271_232556476_n_21487783899157271.jpg",
            ""
        );
        zipFile.addNamedEntry(
            "photos/data/inbox/user_2j57v4wtoa/photos/14567839_1208576379157271_232556476_n_21487783899157271.jpg",
            ""
        );
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            AboutPicturesDataAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new AboutPicturesMinistory({
            account: facebookAccount,
        });
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysisStory);
    });
});

describe("Pictures ministory on export with JPEG pictures in photos_and_videos location", () => {
    let analysisStory = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        zipFile.addNamedEntry(
            "photos_and_videos/TimelinePhotos_24T6AJAQ42/14567839_1208576379157271_232556476_n_21487783899157271.jpg",
            ""
        );

        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            AboutPicturesDataAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new AboutPicturesMinistory({
            account: facebookAccount,
        });
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });
});

describe("Pictures ministory on export with JPEG pictures in posts/media location", () => {
    let analysisStory = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        zipFile.addNamedEntry(
            "posts/media/TimelinePhotos_24T6AJAQ42/14567839_1208576379157271_232556476_n_21487783899157271.jpeg",
            ""
        );

        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            AboutPicturesDataAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new AboutPicturesMinistory({
            account: facebookAccount,
        });
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });
});
