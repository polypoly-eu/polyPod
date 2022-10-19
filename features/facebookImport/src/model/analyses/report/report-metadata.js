import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class ReportMetadataAnalysis extends ReportAnalysis {
    async analyze({ size, zipFile, dataAccount, pod }) {
        const info = await pod.info;
        dataAccount.reports[analysisKeys.reportMetadata] = {};
        dataAccount.reports[analysisKeys.reportMetadata].polyPodRuntime =
            await info.getRuntime();
        dataAccount.reports[analysisKeys.reportMetadata].polyPodVersion =
            await info.getVersion();

        dataAccount.reports[analysisKeys.reportMetadata].fileSize = size;

        const entries = await zipFile.getEntries();
        dataAccount.reports[analysisKeys.reportMetadata].filesCount =
            entries.length;

        console.log(dataAccount);
        dataAccount.reports[analysisKeys.reportMetadata].preferedLanguage =
            dataAccount.languageAndLocale?.preferredLanguage
                ? {
                      name: dataAccount.languageAndLocale?.preferredLanguage
                          .name,
                      code: dataAccount.languageAndLocale?.preferredLanguage
                          .code,
                  }
                : null;
    }
}
