import { ZipFile } from "@polypoly-eu/poly-import";
import { runAnalysis, UnrecognizedData } from "@polypoly-eu/poly-analysis";

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
import UnknownTopLevelFoldersAnalysis from "./analyses/report/unknown-top-level-folders-analysis.js";
import ActivitiesAnalysis from "./analyses/ministories/activities-analysis.js";
import AdvertisingValueAnalysis from "./analyses/ministories/advertising-value-analysis.js";
import AboutPicturesDataAnalysis from "./analyses/ministories/about-pictures-data-analysis.js";
import AdViewsAnalysis from "./analyses/ministories/ad-views-analysis.js";
import OnOffFacebookAdvertisersAnalysis from "./analyses/ministories/on-off-facebook-advertisers-analysis.js";
import PostReactionsTypesAnalysis from "./analyses/ministories/post-reactions-types-analysis.js";

const subAnalyses = [
    DataStructureBubblesAnalysis,
    ActivitiesAnalysis,
    PostReactionsTypesAnalysis,
    MessagesAnalysis,
    AboutPicturesDataAnalysis,
    AdvertisingValueAnalysis,
    OnOffFacebookEventsAnalysis,
    ConnectedAdvertisersAnalysis,

    ExportTitleAnalysis,
    ExportSizeAnalysis,
    DataChartsAnalysis,
    DataGroupsAnalysis,
    JsonFilesBubblesAnalysis,
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
    UnknownTopLevelFoldersAnalysis,
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
        DataChartsAnalysis,
        InteractedWithAdvertisersAnalysis,
        OffFacebookEventsTypesChartAnalysis,
        MessagesDetailsAnalysis,
        EmailAddressesAnalysis,
        SearchesAnalysis,
        FriendsAnalysis,
        ReceivedFriendRequestsAnalysis,
        PagesOverviewAnalysis,
        SesssionActivityLocationsAnalysis,
        AdViewsAnalysis,
        OnOffFacebookAdvertisersAnalysis,
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

export const NUMBER_OF_ANALYSES = subAnalyses.length;

export async function analyzeZip(zipData, zipFile, facebookAccount, pod) {
    const enrichedData = { ...zipData, zipFile, facebookAccount, pod };
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

export async function analyzeFile(zipData, facebookAccount) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return await analyzeZip(zipData, zipFile, facebookAccount, window.pod);
}
