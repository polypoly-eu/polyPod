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

async function analyzeZipWithFiles(files) {
    const zipFile = new ZipFileMock();
    if (files.length > 0) {
        files.forEach((jsonPath) => {
            zipFile.addJsonEntry(jsonPath, { foo: "bar" });
        });
    }
    const { analysisResult } = await runAnalysisForExport(
        JSONFileNamesAnalysis,
        zipFile
    );
    return analysisResult;
}

describe("JSON files analysis for empty zip", () => {
    let status;
    beforeAll(async () => {
        ({ status } = await analyzeZipWithFiles([]));
    });
    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });
});

describe("JSON files analysis for non-empty zip", () => {
    let status;
    let analysis;

    beforeAll(async () => {
        ({ status, analysis } = await analyzeZipWithFiles(commonJsonFiles));
    });
    it("has the right name", () => {
        expect(analysis.reportData).toStrictEqual(commonJsonFiles);
    });

    it("has the right title", () => {
        expect(analysis.title).toBe("JSON file names");
    });
});

describe("JSON files analysis with anonymized path", () => {
    let analysis;
    beforeAll(async () => {
        commonJsonFiles.push(
            "messages/archived_threads/facebookuser_gktxomrifg/message_1.json"
        );
        ({ analysis } = await analyzeZipWithFiles(commonJsonFiles));
    });

    it("has anonymized file", () => {
        expect(analysis.reportData).toContain(
            "messages/archived_threads/uniqueid_hash/message_1.json"
        );
    });
});
