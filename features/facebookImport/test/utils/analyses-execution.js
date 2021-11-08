import { runAnalysis } from "../../src/model/analysis";
import { importZip } from "../../src/model/importer";
import { MockerPod } from "../mocks/pod-mock";

export async function runAnalysisForExport(
    analysisClass,
    zipFile,
    pod = new MockerPod()
) {
    const facebookAccount = await importZip(zipFile);
    const enrichedData = { ...zipFile.enrichedData(), facebookAccount, pod };
    const analysisResult = await runAnalysis(analysisClass, enrichedData);
    return { analysisResult, facebookAccount };
}

export async function runAnalysisForAccount(
    analysisClass,
    facebookAccount,
    pod = new MockerPod()
) {
    const enrichedData = { facebookAccount, pod };
    return runAnalysis(analysisClass, enrichedData);
}
