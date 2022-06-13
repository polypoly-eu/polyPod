import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";

export default class ReportMetadataAnalysis extends ReportAnalysis {
    async analyze({ size, zipFile, dataAccount, pod }) {
        console.log(zipFile);
        const info = await pod.info;
        dataAccount.reports[analysisKeys.reportMetadata] = {};
        dataAccount.reports[analysisKeys.reportMetadata].polyPodRuntime =
            await info.getRuntime();
        dataAccount.reports[analysisKeys.reportMetadata].polyPodVersion =
            await info.getVersion();

        dataAccount.reports[analysisKeys.reportMetadata].fileSize = size;
        dataAccount.reports[analysisKeys.reportMetadata].zipFileName = zipFile._file.name;


        const entries = await zipFile.getEntries();
        dataAccount.reports[analysisKeys.reportMetadata].filesCount =
            entries.length;
    }
}
