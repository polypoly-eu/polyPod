import { MockPod } from "@polypoly-eu/pod-api";
import { importZip } from "@polypoly-eu/poly-import";
import { dataImporters } from "../../src/model/importer";
import {
    runAnalysis,
    analyzeZip,
    ReportStories,
    MinistoriesStatusReport,
} from "@polypoly-eu/poly-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
import { specificAnalyses } from "../../src/model/analysis";
import { ministories } from "../../src/views/ministories/ministories";
import { reports } from "../../src/views/ministories/reports";

export async function runAnalysisForExport(
    analysisClass,
    zipFile,
    pod = new MockPod()
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
    pod = new MockPod()
) {
    const enrichedData = { dataAccount: facebookAccount, pod };
    return runAnalysis(analysisClass, enrichedData);
}

export async function runAnalysesForZip(zipFile) {
    const facebookAccount = await importZip({
        dataImporters,
        zipFile,
        pod: new MockPod(),
        DataAccount: FacebookAccount,
    });
    await analyzeZip({
        zipData: zipFile.enrichedFileData(),
        zipFile,
        dataAccount: facebookAccount,
        specificAnalyses,
        pod: new MockPod(),
    });
    return facebookAccount;
}
export function getReportStories(facebookAccount) {
    const computedReportStoriesList = reports.map(
        (reportClass) => new reportClass({ account: facebookAccount })
    );

    const computedMinistories = ministories.map(
        (MinistoryClass) => new MinistoryClass({ account: facebookAccount })
    );

    const activeReportStories = computedReportStoriesList.filter(
        (reportStory) => reportStory.active
    );
    const statusReport = new MinistoriesStatusReport({
        ministories: [...computedReportStoriesList, ...computedMinistories],
    });

    return new ReportStories([...activeReportStories, statusReport]);
}
