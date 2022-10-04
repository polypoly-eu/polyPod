import JSONFileNamesAnalysis from "../../src/model/analyses/report/json-file-names-analysis";
import commonStructure from "../../src/static/commonStructure";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { runAnalysisForExport } from "../utils/analyses-execution";
import { expectAnalysisSuccessStatus } from "../utils/analysis-assertions";

describe("Missing common JSON files analysis for empty zip", () => {
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        const { _, analysisResult } = await runAnalysisForExport(
            JSONFileNamesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });
});

describe("Missing common JSON files analysis for non-empty zip", () => {
    let status = null;
    let result = null;
    const commonJsonFiles = commonStructure
        .filter((path) => path.match(/\.json$/))
        .map((jsonPath) => {
            return jsonPath.substring(1);
        });
    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        commonJsonFiles.forEach((jsonPath) => {
            zipFile.addJsonEntry(jsonPath, { foo: "bar" });
        });
        const { _, analysisResult } = await runAnalysisForExport(
            JSONFileNamesAnalysis,
            zipFile
        );
        result = analysisResult.analysis;
        ({ status } = analysisResult);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("has the right name", () => {
        expect(result.reportData).toStrictEqual(commonJsonFiles);
    });

    it("has the right title", () => {
        expect(result.title).toBe("JSON file names");
    });
});
