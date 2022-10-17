import JSONFilesBubblesAnalysis from "../../src/model/analyses/ministories/json-files-bubbles";
import commonStructure from "../../src/static/commonStructure";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { runAnalysisForExport } from "../utils/analyses-execution";

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
        JSONFilesBubblesAnalysis,
        zipFile
    );
    return analysisResult;
}

describe("JSON files analysis for non-empty zip", () => {
    let status;
    let analysis;

    beforeAll(async () => {
        ({ status, analysis } = await analyzeZipWithFiles(commonJsonFiles));
    });

    it("reports successful status", () => {
        expect(status.isSuccess).toBe(true);
    });

    it("has the right type and title", () => {
        expect(analysis).toBeInstanceOf(JSONFilesBubblesAnalysis);
        expect(analysis.title).toBe("Files Bubbles");
    });

    it("has the right message count", () => {
        expect(analysis._filesMessagesCount).toHaveLength(10);
    });
});
