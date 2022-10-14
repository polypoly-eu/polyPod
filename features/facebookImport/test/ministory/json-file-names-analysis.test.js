import JSONFileNamesAnalysis from "../../src/model/analyses/report/json-file-names-analysis";
import commonStructure from "../../src/static/commonStructure";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { runAnalysisForExport } from "../utils/analyses-execution";
import { expectAnalysisSuccessStatus } from "../utils/analysis-assertions";

const commonJsonFiles = commonStructure
    .filter((path) => path.match(/\.json$/))
    .map((jsonPath) => {
        return jsonPath.substring(1);
    });

const zipFile = new ZipFileMock();
commonJsonFiles.forEach((jsonPath) => {
    zipFile.addJsonEntry(jsonPath, { foo: "bar" });
});
let status = null;
let analysisResult;
let result = null;

beforeAll(async () => {
    ({ analysisResult } = await runAnalysisForExport(
        JSONFileNamesAnalysis,
        zipFile
    ));
    result = analysisResult.analysis;
    status = analysisResult.status;
});

describe("JSON files analysis for empty zip", () => {
    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });
});

describe("JSON files analysis for non-empty zip", () => {
    it("has the right name", () => {
        expect(result.reportData).toStrictEqual(commonJsonFiles);
    });

    it("has the right title", () => {
        expect(result.title).toBe("JSON file names");
    });
});

describe("JSON files analysis with anonymized path", () => {
    beforeAll(async () => {
        commonJsonFiles.push(
            "messages/archived_threads/facebookuser_gktxomrifg/message_1.json"
        );
        const zipFile = new ZipFileMock();
        commonJsonFiles.forEach((jsonPath) => {
            zipFile.addJsonEntry(jsonPath, { foo: "bar" });
        });
        ({ analysisResult } = await runAnalysisForExport(
            JSONFileNamesAnalysis,
            zipFile
        ));
        result = analysisResult.analysis;
    });

    it("has anonymized file", () => {
        expect(result.reportData).toContain(
            "messages/archived_threads/uniqueid_hash/message_1.json"
        );
    });
});
