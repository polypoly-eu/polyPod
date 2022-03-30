import { runImporters, ZipFile } from "@polypoly-eu/poly-import";

import FacebookAccount from "./entities/facebook-account.js";
import OffFacebookEventsImporter from "./importers/off-facebook-events-importer.js";
import AdInterestsImporter from "./importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "./importers/connected-advertisers-importer.js";
import ConnectedAdvertisersAllTypesImporter from "./importers/connected-advertisers-all-types-importer.js";
import InteractedWithAdvertisersImporter from "./importers/interacted-with-advertisers-importer.js";
import FriendsImporter from "./importers/friends-importer.js";
import FollowedPagesImporter from "./importers/pages-followed-importer.js";
import ReceivedFriendRequestsImporter from "./importers/friend-requests-received-importer.js";
import LikedPagesImporter from "./importers/pages-liked-importer.js";
import RecommendedPagesImporter from "./importers/pages-recommended-importer.js";
import SearchesImporter from "./importers/searches-importer.js";
import UnfollowedPagesImporter from "./importers/pages-unfollowed-importer.js";
import MessagesImporter from "./importers/messages-importer.js";
import AdminRecordsImporter from "./importers/admin-records-importer.js";
import AccountSessionActivitiesImporter from "./importers/account-session-activities-importer.js";
import NameImporter from "./importers/name-importer.js";
import LanguageAndLocaleImporter from "./importers/language-and-locale-importer.js";
import RecentlyViewedAdsImporter from "./importers/recently-viewed-ads-importer.js";
import CommentsImporter from "./importers/comments-importer.js";
import PostReactionsImporter from "./importers/post-reactions-importer.js";
import PostsImporter from "./importers/posts-importer.js";

const dataImporters = [
    AdInterestsImporter,
    ConnectedAdvertisersImporter,
    ConnectedAdvertisersAllTypesImporter,
    OffFacebookEventsImporter,
    InteractedWithAdvertisersImporter,
    FriendsImporter,
    FollowedPagesImporter,
    LikedPagesImporter,
    ReceivedFriendRequestsImporter,
    RecommendedPagesImporter,
    SearchesImporter,
    UnfollowedPagesImporter,
    MessagesImporter,
    AdminRecordsImporter,
    AccountSessionActivitiesImporter,
    NameImporter,
    LanguageAndLocaleImporter,
    RecentlyViewedAdsImporter,
    CommentsImporter,
    PostReactionsImporter,
    PostsImporter,
];

export const NUMBER_OF_IMPORTERS = dataImporters.length;

export async function importZip(zipFile, pod) {
    const facebookAccount = new FacebookAccount();
    const importingResults = await runImporters(
        dataImporters,
        zipFile,
        facebookAccount,
        pod
    );

    facebookAccount.importingResults = importingResults;

    return facebookAccount;
}

export async function importData(zipData) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return importZip(zipFile, window.pod);
}
