import PostReactionsTypesAnalysis from "../../src/model/analyses/ministories/post-reactions-types-analysis";
import { zipFileWithPostReactions } from "../datasets/post-reactions-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
    expectInactiveAnalysis,
} from "../utils/analysis-assertions";

describe("Post reactions analysis for empty zip", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        const { analysisResult } = await runAnalysisForExport(
            PostReactionsTypesAnalysis,
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

describe("Post reactions analysis from export data", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const zipFile = zipFileWithPostReactions();
        const { analysisResult } = await runAnalysisForExport(
            PostReactionsTypesAnalysis,
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

    it("has correct reactions per type", async () => {
        expect(analysis._reactionsTypeCountPairs).toStrictEqual([
            { type: "LIKE", count: 3 },
            { type: "WOW", count: 2 },
            { type: "SAD", count: 1 },
        ]);
    });
});
