import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../../analysisKeys";

export default class ReportMetadataAnalysis extends ReportAnalysis {
    async analyze({ size, zipFile, dataAccount, pod }) {
        const info = await pod.info;
        dataAccount.analyses[analysisKeys.reportMetadata].polyPodRuntime =
            await info.getRuntime();
        dataAccount.analyses[analysisKeys.reportMetadata].polyPodVersion =
            await info.getVersion();

        dataAccount.analyses[analysisKeys.reportMetadata].size = size;

        const entries = await zipFile.getEntries();
        dataAccount.analyses[analysisKeys.reportMetadata].filesCount =
            entries.length;

        dataAccount.analyses[analysisKeys.reportMetadata].preferedLanguage =
            dataAccount.preferredLanguage
                ? {
                      name: dataAccount.preferredLanguage.name,
                      code: dataAccount.preferredLanguage.code,
                  }
                : null;
    }
}
