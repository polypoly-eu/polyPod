import { MockerPod } from "../mocks/pod-mock";
import { importZip } from "@polypoly-eu/poly-import";
import { analyzeZip } from "../../src/model/analysis";
import { dataImporters } from "../../src/model/importer";
import { runAnalysis } from "@polypoly-eu/poly-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";

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

export async function runAnalysesForZip(zipFile) {
    const facebookAccount = await importZip({
        dataImporters,
        zipFile,
        DataAccount: FacebookAccount,
    });
    return await analyzeZip(
        zipFile.enrichedFileData(),
        zipFile,
        facebookAccount,
        new MockerPod()
    );
}
