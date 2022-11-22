import OffFacebookEventsImporter from "./off-facebook-events-importer.js";
import AdInterestsImporter from "./ad-interests-importer.js";
import ConnectedAdvertisersImporter from "./connected-advertisers-importer.js";
import ConnectedAdvertisersAllTypesImporter from "./connected-advertisers-all-types-importer.js";
import InteractedWithAdvertisersImporter from "./interacted-with-advertisers-importer.js";
import FriendsImporter from "./friends-importer.js";
import FollowedPagesImporter from "./pages-followed-importer.js";
import OldFollowedPagesImporter from "./old-pages-followed-importer.js";
import ReceivedFriendRequestsImporter from "./friend-requests-received-importer.js";
import LikedPagesImporter from "./pages-liked-importer.js";
import OldLikedPagesImporter from "./old-pages-liked-importer.js";
import RecommendedPagesImporter from "./pages-recommended-importer.js";
import OldRecommendedPagesImporter from "./old-pages-recommended-importer.js";
import SearchesImporter from "./searches-importer.js";
import UnfollowedPagesImporter from "./pages-unfollowed-importer.js";
import OldUnfollowedPagesImporter from "./old-pages-unfollowed-importer.js";
import MessagesImporter from "./messages-importer.js";
import AdminRecordsImporter from "./admin-records-importer.js";
import AccountSessionActivitiesImporter from "./account-session-activities-importer.js";
import PersonalDataImporter from "./personal-data-importer.js";
import LanguageAndLocaleImporter from "./language-and-locale-importer.js";
import RecentlyViewedAdsImporter from "./recently-viewed-ads-importer.js";
import CommentsImporter from "./comments-importer.js";
import PostReactionsImporter from "./post-reactions-importer.js";
import PostsImporter from "./posts-importer.js";

export const importers = [
    AdInterestsImporter,
    ConnectedAdvertisersImporter,
    ConnectedAdvertisersAllTypesImporter,
    OffFacebookEventsImporter,
    InteractedWithAdvertisersImporter,
    FriendsImporter,
    FollowedPagesImporter,
    OldFollowedPagesImporter,
    LikedPagesImporter,
    OldLikedPagesImporter,
    ReceivedFriendRequestsImporter,
    RecommendedPagesImporter,
    OldRecommendedPagesImporter,
    SearchesImporter,
    UnfollowedPagesImporter,
    OldUnfollowedPagesImporter,
    MessagesImporter,
    AdminRecordsImporter,
    AccountSessionActivitiesImporter,
    PersonalDataImporter,
    LanguageAndLocaleImporter,
    RecentlyViewedAdsImporter,
    CommentsImporter,
    PostReactionsImporter,
    PostsImporter,
];
