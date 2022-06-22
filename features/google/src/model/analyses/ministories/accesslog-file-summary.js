import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";

export default class AccessLogSummaryAnalysis extends ReportAnalysis {
    async analyze({ dataAccount: googleAccount }) {
        const accessLogSummary = googleAccount.accessLogSummary;
        const allAccessLogsSummary = {
            fileName: accessLogSummary[0].fileName,
            fileSize: accessLogSummary.reduce(
                (total, next) => total + next.size,
                0
            ),
        };

        if (accessLogSummary.length > 0)
            googleAccount.reports[analysisKeys.accessLogSummary] =
                allAccessLogsSummary;
    }
}
