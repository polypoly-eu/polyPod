import MissingCommonJSONFilesAnalysis from "../../src/model/analyses/report/missing-common-json-files";
import commonStructure from "../../src/static/commonStructure";
import MissingCommonJSONFilesReport from "../../src/views/ministories/missingCommonJsonFiles";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
    expectInactiveAnalysis,
} from "../utils/analysis-assertions";

describe("Missing common JSON files analysis for empty zip", () => {
    let analysisReport = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            MissingCommonJSONFilesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisReport = new MissingCommonJSONFilesReport(facebookAccount);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisReport);
    });

    it("has id in JSON report", async () => {
        expect(analysisReport.jsonReport.id).toBe(
            getReportNameFromAnalaysis(MissingCommonJSONFilesAnalysis)
        );
    });

    it("has all common files in JSON report", async () => {
        const missingJsonFileNames = commonStructure.filter((each) =>
            each.endsWith(".json")
        );
        expect(analysisReport.jsonReport.data).toStrictEqual(
            missingJsonFileNames
        );
    });
});

describe("Missing common JSON files analysis for zip with no missing common files", () => {
    let analysisReport = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        commonStructure
            .filter((each) => each.endsWith(".json"))
            .forEach((each) => zipFile.addJsonEntry(each.substring(1), {}));
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            MissingCommonJSONFilesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisReport = new MissingCommonJSONFilesReport(facebookAccount);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysisReport);
    });
});

function getReportNameFromAnalaysis(analysis) {
    return analysis.name.replace("Analysis", "Report");
}
