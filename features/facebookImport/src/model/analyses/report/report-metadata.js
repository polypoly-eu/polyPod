import { ReportAnalysis } from "@polypoly-eu/poly-analysis";

export default class ReportMetadataAnalysis extends ReportAnalysis {
    async analyze({ size, zipFile, dataAccount, pod }) {
        const info = await pod.info;
        dataAccount.processedData._reportMetadata = {};
        dataAccount.processedData._reportMetadata.polyPodRuntime =
            await info.getRuntime();
        dataAccount.processedData._reportMetadata.polyPodVersion =
            await info.getVersion();

        dataAccount.processedData._reportMetadata.fileSize = size;

        const entries = await zipFile.getEntries();
        dataAccount.processedData._reportMetadata.filesCount = entries.length;

        dataAccount.processedData._reportMetadata.preferedLanguage =
            dataAccount.preferredLanguage
                ? {
                      name: dataAccount.preferredLanguage.name,
                      code: dataAccount.preferredLanguage.code,
                  }
                : null;
    }
}
