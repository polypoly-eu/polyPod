import { MockerPod } from "../mocks/pod-mock";
import { importZip } from "@polypoly-eu/poly-import";
import { dataImporters } from "../../src/model/importer";
import { runAnalysis, analyzeZip } from "@polypoly-eu/poly-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
import { subAnalyses } from "../../src/model/analysis";

export async function runAnalysisForExport(
    analysisClass,
    zipFile,
    pod = new MockerPod()
) {
    const facebookAccount = await importZip({
        dataImporters,
        zipFile,
        DataAccount: FacebookAccount,
    });
    const enrichedData = {
        ...zipFile.enrichedData(),
        dataAccount: facebookAccount,
        pod,
    };
    const analysisResult = await runAnalysis(analysisClass, enrichedData);
    return { analysisResult, facebookAccount };
}

export async function runAnalysisForAccount(
    analysisClass,
    facebookAccount,
    pod = new MockerPod()
) {
    const enrichedData = { dataAccount: facebookAccount, pod };
    return runAnalysis(analysisClass, enrichedData);
}

export async function runAnalysesForZip(zipFile) {
    const facebookAccount = await importZip({
        dataImporters,
        zipFile,
        pod: new MockerPod(),
        DataAccount: FacebookAccount,
    });
    await analyzeZip({
        zipData: zipFile.enrichedFileData(),
        zipFile,
        dataAccount: facebookAccount,
        subAnalyses,
        pod: new MockerPod(),
    });
    return facebookAccount;
}
