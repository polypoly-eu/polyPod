import DataGroupsAnalysis from "./ministories/data-groups-analysis.js";
import ConnectedAdvertisersAnalysis from "./ministories/connected-advertisers-analysis.js";
import InteractedWithAdvertisersAnalysis from "./ministories/interacted-advertisers-analysis.js";
import AdInterestsAnalysis from "./ministories/ad-interests-analysis.js";
import OnOffFacebookEventsAnalysis from "./ministories/on-off-facebook-events-analysis.js";
import MessagesAnalysis from "./ministories/messages-analysis.js";
import SearchesAnalysis from "./ministories/searches-analysis.js";
import FriendsAnalysis from "./ministories/friends-analysis.js";
import ReceivedFriendRequestsAnalysis from "./ministories/friend-requests-received-analysis.js";
import PagesOverviewAnalysis from "./ministories/pages-overview-activity.js";
import ReportMetadataAnalysis from "./report/report-metadata.js";
import NoDataFoldersAnalysis from "./report/no-data-folders.js";
import MissingCommonJSONFilesAnalysis from "./report/missing-common-json-files.js";
import MissingKnownJSONFilesAnalysis from "./report/missing-known-json-files.js";
import UnknownJSONFilesAnalysis from "./report/unknown-json-files.js";
import MessagesDetailsAnalysis from "./ministories/messages-details-analysis.js";
import MessageThreadsAnalysis from "./ministories/message-threads-analysis.js";
import OffFacebookEventsTypesAnalysis from "./ministories/off-facebook-events-types-analysis.js";
import DataChartsAnalysis from "./ministories/data-points-charts-analysis.js";
import OffFacebookEventsTypesChartAnalysis from "./ministories/off-facebook-events-types-charts-analysis.js";
import JsonFilesBubblesAnalysis from "./ministories/json-files-bubbles.js";
import ImportedJsonFilesAnalysis from "./ministories/json-files-imported-analysis.js";
import ExportTitleAnalysis from "./ministories/export-title-analysis.js";
import ExportSizeAnalysis from "./ministories/export-size-analysis.js";
import EmailAddressesAnalysis from "./ministories/email-addresses-analysis.js";
import UnknownMessageTypesAnalysis from "./report/unkown-message-types-analysis.js";
import SesssionActivityLocationsAnalysis from "./ministories/activity-locations-analysis.js";
import MessagesActivityAnalysis from "./ministories/messages-activity-analysis.js";
import JSONFileNamesAnalysis from "./report/json-file-names-analysis.js";
import OffFacebookEventTypesAnalysis from "./report/off-facebook-event-types-analysis.js";
import UnknownTopLevelFoldersAnalysis from "./report/unknown-top-level-folders-analysis.js";
import ActivitiesAnalysis from "./ministories/activities-analysis.js";
import AdvertisingValueAnalysis from "./ministories/advertising-value-analysis.js";
import AboutPicturesDataAnalysis from "./ministories/about-pictures-data-analysis.js";
import AdViewsAnalysis from "./ministories/ad-views-analysis.js";
import OnOffFacebookAdvertisersAnalysis from "./ministories/on-off-facebook-advertisers-analysis.js";
import PostReactionsTypesAnalysis from "./ministories/post-reactions-types-analysis.js";

export const analyses = [
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
