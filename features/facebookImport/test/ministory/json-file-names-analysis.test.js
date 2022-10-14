import JSONFileNamesAnalysis from "../../src/model/analyses/report/json-file-names-analysis";
import commonStructure from "../../src/static/commonStructure";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { runAnalysisForExport } from "../utils/analyses-execution";
import { expectAnalysisSuccessStatus } from "../utils/analysis-assertions";

describe("JSON files analysis for empty zip", () => {
    let status = null;

    beforeAll(async () => {
        const zipFile = new ZipFileMock();
        const { analysisResult } = await runAnalysisForExport(
            JSONFileNamesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });
});

describe("JSON files analysis for non-empty zip", () => {
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
        const { analysisResult } = await runAnalysisForExport(
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

describe("JSON files analysis with anonymized path", () => {
    let result = null;
    let commonJsonFiles = commonStructure
        .filter((path) => path.match(/\.json$/))
        .map((jsonPath) => {
            return jsonPath.substring(1);
        });
    commonJsonFiles.push(
        "messages/archived_threads/facebookuser_gktxomrifg/message_1.json"
    );

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        commonJsonFiles.forEach((jsonPath) => {
            zipFile.addJsonEntry(jsonPath, { foo: "bar" });
        });
        const { analysisResult } = await runAnalysisForExport(
            JSONFileNamesAnalysis,
            zipFile
        );
        result = analysisResult.analysis;
    });

    it("has anonymized file", () => {
        expect(result.reportData).toContain(
            "messages/archived_threads/uniqueid_hash/message_1.json"
        );
    });
});
