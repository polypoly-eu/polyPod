import MissingCommonJSONFilesAnalysis from "../../src/model/analyses/report/missing-common-json-files";
import commonStructure from "../../src/static/commonStructure";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
    expectInactiveAnalysis,
} from "../utils/analysis-assertions";

describe("Missing common JSON files analysis for empty zip", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        const { analysisResult } = await runAnalysisForExport(
            MissingCommonJSONFilesAnalysis,
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

describe("Missing common JSON files analysis for zip with no missing common files", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        commonStructure
            .filter((each) => each.endsWith(".json"))
            .forEach((each) => zipFile.addJsonEntry(each.substring(1), {}));
        const { analysisResult } = await runAnalysisForExport(
            MissingCommonJSONFilesAnalysis,
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
