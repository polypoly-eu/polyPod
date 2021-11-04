import { ZipFile } from "../model/storage.js";
import {
    createErrorStatus,
    createSuccessStatus,
} from "./analyses/utils/analysis-status.js";

import DataStructureBubblesAnalysis from "./analyses/ministories/data-structure-bubbles-analysis.js";
import DataGroupsAnalysis from "./analyses/ministories/data-groups-analysis.js";
import ConnectedAdvertisersAnalysis from "./analyses/ministories/connected-advertisers-analysis.js";
import InteractedWithAdvertisersAnalysis from "./analyses/ministories/interacted-advertisers-analysis.js";
import AdInterestsAnalysis from "./analyses/ministories/ad-interests-analysis.js";
import OnOffFacebookEventsAnalysis from "./analyses/ministories/on-off-facebook-events-analysis.js";
import MessagesAnalysis from "./analyses/ministories/messages-analysis.js";
import SearchesAnalysis from "./analyses/ministories/searches-analysis.js";
import FriendsAnalysis from "./analyses/ministories/friends-analysis.js";
import ReceivedFriendRequestsAnalysis from "./analyses/ministories/friend-requests-received-analysis.js";
import PagesOverviewAnalysis from "./analyses/ministories/pages-overview-activity.js";
import ReportMetadataAnalysis from "./analyses/report/report-metadata.js";
import NoDataFoldersAnalysis from "./analyses/report/no-data-folders.js";
import MissingCommonJSONFilesAnalysis from "./analyses/report/missing-common-json-files.js";
import MissingKnownJSONFilesAnalysis from "./analyses/report/missing-known-json-files.js";
import UnknownJSONFilesAnalysis from "./analyses/report/unknown-json-files.js";
import MessagesDetailsAnalysis from "./analyses/ministories/messages-details-analysis.js";
import MessageThreadsAnalysis from "./analyses/ministories/message-threads-analysis.js";
import OffFacebookEventsTypesAnalysis from "./analyses/ministories/off-facebook-events-types-analysys.js";
import DataChartsAnalysis from "./analyses/ministories/data-points-charts-analysis.js";
import OffFacebookEventsTypesChartAnalysis from "./analyses/ministories/off-facebook-events-types-charts-analysis.js";
import DataImportingStatusAnalysis from "./analyses/report/importing-status-analysys.js";
import JsonFilesBubblesAnalysis from "./analyses/ministories/json-files-bubbles.js";
import ImportedJsonFilesAnalysis from "./analyses/ministories/json-files-imported-analysis.js";
import ExportTitleAnalysis from "./analyses/ministories/export-title-analysis.js";
import ExportSizeAnalysis from "./analyses/ministories/export-size-analysis.js";
import EmailAddressesAnalysis from "./analyses/ministories/email-addresses-analysis.js";
import UnknownMessageTypesAnalysis from "./analyses/report/unkown-message-types-analysis.js";
import SesssionActivityLocationsAnalysis from "./analyses/ministories/activity-locations-analysis.js";
import MessagesActivityAnalysis from "./analyses/ministories/messages-activity-analysis.js";
import JSONFileNamesAnalysis from "./analyses/report/json-file-names-analysis.js";
import OffFacebookEventTypesAnalysis from "./analyses/report/off-facebook-event-types-analysis.js";
import UknownTopLevelFoldersAnalysis from "./analyses/report/unknown-top-level-folders-analysis.js";
import InactiveCardsSummary from "./analyses/report/inactive-cards-summary.js";
import ActivitiesAnalysis from "./analyses/ministories/activities-analysis.js";
import AdvertisingValueAnalysis from "./analyses/ministories/advertising-value-analysis.js";
import AboutPicturesDataAnalysis from "./analyses/ministories/about-pictures-data-analysis.js";
import AdViewsAnalysis from "./analyses/ministories/ad-views-analysis.js";
import OnOffFacebookAdvertisersAnalysis from "./analyses/ministories/on-off-facebook-advertisers-analysis.js";
import PostReactionsTypesAnalysis from "./analyses/ministories/post-reactions-types-analysis.js";
import { Telemetry } from "./analyses/utils/performance-telemetry.js";
import MinistoriesStatusAnalysis from "./analyses/report/ministories-status-analysis.js";

const subAnalyses = [
    DataStructureBubblesAnalysis,
    ActivitiesAnalysis,
    MessagesAnalysis,
    OnOffFacebookEventsAnalysis,
    AboutPicturesDataAnalysis,
    AdvertisingValueAnalysis,

    PostReactionsTypesAnalysis,
    ExportTitleAnalysis,
    ExportSizeAnalysis,
    DataChartsAnalysis,
    DataGroupsAnalysis,
    JsonFilesBubblesAnalysis,
    ConnectedAdvertisersAnalysis,
    InteractedWithAdvertisersAnalysis,
    AdInterestsAnalysis,
    OffFacebookEventsTypesChartAnalysis,
    OffFacebookEventsTypesAnalysis,
    MessagesDetailsAnalysis,
    EmailAddressesAnalysis,
    MessageThreadsAnalysis,
    MessagesActivityAnalysis,
    SearchesAnalysis,
    FriendsAnalysis,
    ReceivedFriendRequestsAnalysis,
    PagesOverviewAnalysis,
    SesssionActivityLocationsAnalysis,
    ImportedJsonFilesAnalysis,
    AdViewsAnalysis,
    OnOffFacebookAdvertisersAnalysis,

    ReportMetadataAnalysis,
    DataImportingStatusAnalysis,
    UknownTopLevelFoldersAnalysis,
    MissingCommonJSONFilesAnalysis,
    MissingKnownJSONFilesAnalysis,
    OffFacebookEventTypesAnalysis,
    UnknownJSONFilesAnalysis,
    JSONFileNamesAnalysis,
    NoDataFoldersAnalysis,
    UnknownMessageTypesAnalysis,
].filter((analysis) => {
    // Some analysis are disabled because we don't want to include them
    // in the current build, but it seems likely that we want to reintegrate
    // them before too long - or show them behind some kind of flag, or
    // developer mode.
    return ![
        ExportTitleAnalysis,
        ExportSizeAnalysis,
        DataGroupsAnalysis,
        JsonFilesBubblesAnalysis,
        AdInterestsAnalysis,
        OffFacebookEventsTypesAnalysis,
        MessageThreadsAnalysis,
        MessagesActivityAnalysis,

        ImportedJsonFilesAnalysis,
        UnknownJSONFilesAnalysis,
        JSONFileNamesAnalysis,
        NoDataFoldersAnalysis,
        UnknownMessageTypesAnalysis,
    ].includes(analysis);
});

class UnrecognizedData {
    constructor(analysesResults) {
        this._activeReportAnalyses = analysesResults
            .filter(
                ({ analysis, status }) =>
                    status.isSuccess &&
                    analysis.isForDataReport &&
                    analysis.active
            )
            .map(({ analysis }) => analysis);

        const inactiveCardsSummary = new InactiveCardsSummary(analysesResults);
        if (inactiveCardsSummary.active) {
            this._activeReportAnalyses.push(inactiveCardsSummary);
        }

        const statusAnalysis = new MinistoriesStatusAnalysis(analysesResults);
        if (statusAnalysis.active) {
            this._activeReportAnalyses.push(statusAnalysis);
        }

        this.active = this._activeReportAnalyses.length > 0;
    }

    get reportAnalyses() {
        return this._activeReportAnalyses;
    }

    get report() {
        if (!this.active) {
            return "No data to report!";
        }
        return (
            this.reportAnalyses.length +
            " " +
            (this.reportAnalyses.length > 0 ? "analyses" : "analysis") +
            "  included in the report"
        );
    }

    get jsonReport() {
        if (!this.active) {
            return {};
        }

        const reportAnalyses = this.reportAnalyses.map(
            (analysis) => analysis.jsonReport
        );

        return { reportAnalyses_v1: reportAnalyses };
    }
}

export async function runAnalysis(analysisClass, enrichedData) {
    const subAnalysis = new analysisClass();

    const telemetry = new Telemetry();
    try {
        const status = await subAnalysis.analyze(enrichedData);
        return {
            analysis: subAnalysis,
            status: status || createSuccessStatus(analysisClass),
            executionTime: telemetry.elapsedTime(),
        };
    } catch (error) {
        return {
            analysis: subAnalysis,
            status: createErrorStatus(analysisClass, error),
            executionTime: telemetry.elapsedTime(),
        };
    }
}

export async function analyzeFile(file, facebookAccount) {
    const zipFile = new ZipFile(file, window.pod);
    const enrichedData = { ...file, zipFile, facebookAccount };
    const analysesResults = await Promise.all(
        subAnalyses.map(async (subAnalysisClass) => {
            return runAnalysis(subAnalysisClass, enrichedData);
        })
    );

    const successfullyExecutedAnalyses = analysesResults
        .filter(({ status }) => status.isSuccess)
        .map(({ analysis }) => analysis);
    const activeGlobalAnalyses = successfullyExecutedAnalyses.filter(
        (analysis) => !analysis.isForDataReport && analysis.active
    );

    return {
        analyses: activeGlobalAnalyses,
        unrecognizedData: new UnrecognizedData(analysesResults),
    };
}
