import { runAnalysis } from "../../src/model/analysis";
import { importZip } from "../../src/model/importer";

export async function runAnalysisForExport(analysisClass, zipFile) {
    const facebookAccount = await importZip(
        zipFile,
        zipFile.enrichedFileData()
    );
    const enrichedData = { ...zipFile.enrichedData(), facebookAccount };
    const analysisResult = await runAnalysis(analysisClass, enrichedData);
    return { ...analysisResult, facebookAccount };
}

export async function runAnalysisForAccount(analysisClass, facebookAccount) {
    const enrichedData = { facebookAccount };
    return runAnalysis(analysisClass, enrichedData);
}
