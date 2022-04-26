import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class ReportMetadataAnalysis extends ReportAnalysis {
    async analyze({ size, zipFile, dataAccount, pod }) {
        const info = await pod.info;
        dataAccount.processedData[analysisKeys.reportMetadata] = {};
        dataAccount.processedData[analysisKeys.reportMetadata].polyPodRuntime =
            await info.getRuntime();
        dataAccount.processedData[analysisKeys.reportMetadata].polyPodVersion =
            await info.getVersion();

        dataAccount.processedData[analysisKeys.reportMetadata].fileSize = size;

        const entries = await zipFile.getEntries();
        dataAccount.processedData[analysisKeys.reportMetadata].filesCount =
            entries.length;

        dataAccount.processedData[
            analysisKeys.reportMetadata
        ].preferedLanguage = dataAccount.preferredLanguage
            ? {
                  name: dataAccount.preferredLanguage.name,
                  code: dataAccount.preferredLanguage.code,
              }
            : null;
    }
}
