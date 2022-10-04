import JSONFileNamesAnalysis from "../../src/model/analyses/report/missing-common-json-files";
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

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        commonStructure
            .filter((path) => path.match(/\.json$/))
            .forEach((jsonPath) => {
                zipFile.addJsonEntry(jsonPath.substring(1), { foo: "bar" });
            });
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
