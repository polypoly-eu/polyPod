import {
    MinistoriesStatusReport,
    ReportStories,
} from "@polypoly-eu/poly-analysis";
import { ministories } from "../ministories/ministories.js";
import { reports } from "../ministories/reports.js";

import i18n from "!silly-i18n";

export default function computeReportStories(account) {
    if (!account) return null;

    const computedReportStoriesList = reports.map(
        (reportClass) => new reportClass({ account })
    );

    const computedMinistories = ministories.map(
        (ministoryClass) => new ministoryClass({ account })
    );
    const activeReportStories = computedReportStoriesList.filter(
        (reportStory) => reportStory.active
    );
    const statusReport = new MinistoriesStatusReport({
        ministories: [...computedReportStoriesList, ...computedMinistories],
        title: i18n.t("report:mini.story.status"),
        description: i18n.t("report:mini.story.status.details"),
    });

    return new ReportStories([...activeReportStories, statusReport]);
}
