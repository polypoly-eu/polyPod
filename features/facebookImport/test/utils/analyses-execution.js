import { MockerPod } from "../mocks/pod-mock";
import { importZip } from "@polypoly-eu/poly-import";
import { dataImporters } from "../../src/model/importer";
import {
    ReportStories,
    MinistoriesStatusReport,
} from "@polypoly-eu/poly-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
import { subAnalyses } from "../../src/model/analysis";
import { ministories } from "../../src/views/ministories/ministories";
import { reports } from "../../src/views/ministories/reports";

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
    const analysisResult = await facebookAccount.runAnalysis(
        analysisClass,
        enrichedData
    );
    return { analysisResult, facebookAccount };
}

export async function runAnalysisForAccount(
    analysisClass,
    facebookAccount,
    pod = new MockerPod()
) {
    const enrichedData = { dataAccount: facebookAccount, pod };
    return facebookAccount.runAnalysis(analysisClass, enrichedData);
}

export async function runAnalysesForZip(zipFile) {
    const facebookAccount = await importZip({
        dataImporters,
        zipFile,
        pod: new MockerPod(),
        DataAccount: FacebookAccount,
    });
    await facebookAccount.analyzeZip({
        zipData: zipFile.enrichedFileData(),
        zipFile,
        subAnalyses,
        pod: new MockerPod(),
    });
    return facebookAccount;
}
export function getReportStories(facebookAccount) {
    const computedReportStoriesList = reports.map(
        (reportClass) => new reportClass(facebookAccount)
    );

    const computedMinistories = ministories.map(
        (MinistoryClass) => new MinistoryClass(facebookAccount)
    );

    const activeReportStories = computedReportStoriesList.filter(
        (reportStory) => reportStory.active
    );
    const statusReport = new MinistoriesStatusReport([
        ...computedReportStoriesList,
        ...computedMinistories,
    ]);

    return new ReportStories([...activeReportStories, statusReport]);
}
