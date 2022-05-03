import PostReactionsTypesAnalysis from "../../src/model/analyses/ministories/post-reactions-types-analysis";
import PostReactionTypesMinistory from "../../src/views/ministories/postReactionsTypes";
import { zipFileWithPostReactions } from "../datasets/post-reactions-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
    expectInactiveAnalysis,
} from "../utils/analysis-assertions";

describe("Post reactions analysis for empty zip", () => {
    let analysisStory = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            PostReactionsTypesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new PostReactionTypesMinistory({
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

describe("Post reactions analysis from export data", () => {
    let analysisStory = null;
    let analysisData = null;
    let status = null;

    beforeAll(async () => {
        const zipFile = zipFileWithPostReactions();
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            PostReactionsTypesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new PostReactionTypesMinistory({
            account: facebookAccount,
        });
        analysisData = {
            reactionsTypeCountPairs: analysisStory.analysisData,
        };
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });

    it("has correct reactions per type", async () => {
        expect(analysisData.reactionsTypeCountPairs).toStrictEqual([
            { type: "LIKE", count: 3 },
            { type: "WOW", count: 2 },
            { type: "SAD", count: 1 },
            { type: "ANGER", count: 1 },
        ]);
    });
});
