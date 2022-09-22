import OffFacebookEventsImporter, {
    OFF_FACEBOOK_EVENTS_STORAGE_KEY,
} from "./importers/off-facebook-events-importer.js";
import AdInterestsImporter, {
    AD_INTERESTS_STORAGE_KEY,
} from "./importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter, {
    CONNECTED_ADVERTISERS_STORAGE_KEY,
} from "./importers/connected-advertisers-importer.js";
import ConnectedAdvertisersAllTypesImporter, {
    CONNECTED_ADVERTISERS_ALL_TYPES_STORAGE_KEY,
} from "./importers/connected-advertisers-all-types-importer.js";
import InteractedWithAdvertisersImporter, {
    INTERACTED_WITH_ADVERTISERS_STORAGE_KEY,
} from "./importers/interacted-with-advertisers-importer.js";
import FriendsImporter, {
    FRIENDS_STORAGE_KEY,
} from "./importers/friends-importer.js";
import FollowedPagesImporter, {
    FOLLOWED_PAGES_STORAGE_KEY,
} from "./importers/pages-followed-importer.js";
import OldFollowedPagesImporter from "./importers/old-pages-followed-importer.js";
import ReceivedFriendRequestsImporter, {
    RECEIVED_FRIEND_REQUESTS_STORAGE_KEY,
} from "./importers/friend-requests-received-importer.js";
import LikedPagesImporter, {
    LIKED_PAGES_STORAGE_KEY,
} from "./importers/pages-liked-importer.js";
import OldLikedPagesImporter from "./importers/old-pages-liked-importer.js";
import RecommendedPagesImporter, {
    RECOMMENDED_PAGES_STORAGE_KEY,
} from "./importers/pages-recommended-importer.js";
import OldRecommendedPagesImporter from "./importers/old-pages-recommended-importer.js";
import SearchesImporter, {
    SEARCHES_INTERESTS_STORAGE_KEY,
} from "./importers/searches-importer.js";
import UnfollowedPagesImporter, {
    UNFOLLOWED_PAGES_STORAGE_KEY,
} from "./importers/pages-unfollowed-importer.js";
import OldUnfollowedPagesImporter from "./importers/old-pages-unfollowed-importer.js";
import MessagesImporter, {
    MESSAGES_STORAGE_KEY,
} from "./importers/messages-importer.js";
import AdminRecordsImporter, {
    ADMIN_RECORDS_STORAGE_KEY,
} from "./importers/admin-records-importer.js";
import AccountSessionActivitiesImporter, {
    SESSION_ACTIVITIES_STORAGE_KEY,
} from "./importers/account-session-activities-importer.js";
import PersonalDataImporter, {
    PERSONAL_DATA_STORAGE_KEY,
} from "./importers/personal-data-importer.js";
import LanguageAndLocaleImporter, {
    LANGUAGE_AND_LOCALE_STORAGE_KEY,
} from "./importers/language-and-locale-importer.js";
import RecentlyViewedAdsImporter, {
    RECENTLY_VIEWED_STORAGE_KEY,
} from "./importers/recently-viewed-ads-importer.js";
import CommentsImporter, {
    COMMENTS_STORAGE_KEY,
} from "./importers/comments-importer.js";
import PostReactionsImporter, {
    POST_REACTIONS_STORAGE_KEY,
} from "./importers/post-reactions-importer.js";
import PostsImporter, {
    POSTS_DATA_STORAGE_KEY,
} from "./importers/posts-importer.js";

//Here importers are added if they should be used in the facebook importer
//The STORAGE_KEY they defined will be what they are referenced by after they are added to the account
export const dataImporters = [
    {
        storageKey: PERSONAL_DATA_STORAGE_KEY,
        importerClass: PersonalDataImporter,
    },
    {
        storageKey: OFF_FACEBOOK_EVENTS_STORAGE_KEY,
        importerClass: OffFacebookEventsImporter,
    },
    {
        storageKey: AD_INTERESTS_STORAGE_KEY,
        importerClass: AdInterestsImporter,
    },
    {
        storageKey: CONNECTED_ADVERTISERS_STORAGE_KEY,
        importerClass: ConnectedAdvertisersImporter,
    },
    {
        storageKey: CONNECTED_ADVERTISERS_ALL_TYPES_STORAGE_KEY,
        importerClass: ConnectedAdvertisersAllTypesImporter,
    },
    {
        storageKey: INTERACTED_WITH_ADVERTISERS_STORAGE_KEY,
        importerClass: InteractedWithAdvertisersImporter,
    },
    { storageKey: FRIENDS_STORAGE_KEY, importerClass: FriendsImporter },
    {
        storageKey: FOLLOWED_PAGES_STORAGE_KEY,
        importerClass: FollowedPagesImporter,
    },
    {
        storageKey: RECEIVED_FRIEND_REQUESTS_STORAGE_KEY,
        importerClass: ReceivedFriendRequestsImporter,
    },
    { storageKey: LIKED_PAGES_STORAGE_KEY, importerClass: LikedPagesImporter },
    {
        storageKey: RECOMMENDED_PAGES_STORAGE_KEY,
        importerClass: RecommendedPagesImporter,
    },
    {
        storageKey: SEARCHES_INTERESTS_STORAGE_KEY,
        importerClass: SearchesImporter,
    },
    {
        storageKey: UNFOLLOWED_PAGES_STORAGE_KEY,
        importerClass: UnfollowedPagesImporter,
    },
    { storageKey: MESSAGES_STORAGE_KEY, importerClass: MessagesImporter },
    {
        storageKey: ADMIN_RECORDS_STORAGE_KEY,
        importerClass: AdminRecordsImporter,
    },
    {
        storageKey: SESSION_ACTIVITIES_STORAGE_KEY,
        importerClass: AccountSessionActivitiesImporter,
    },
    {
        storageKey: LANGUAGE_AND_LOCALE_STORAGE_KEY,
        importerClass: LanguageAndLocaleImporter,
    },
    {
        storageKey: RECENTLY_VIEWED_STORAGE_KEY,
        importerClass: RecentlyViewedAdsImporter,
    },
    { storageKey: COMMENTS_STORAGE_KEY, importerClass: CommentsImporter },
    {
        storageKey: POST_REACTIONS_STORAGE_KEY,
        importerClass: PostReactionsImporter,
    },
    { storageKey: POSTS_DATA_STORAGE_KEY, importerClass: PostsImporter },
    {
        storageKey: FOLLOWED_PAGES_STORAGE_KEY,
        importerClass: OldFollowedPagesImporter,
    },
    {
        storageKey: LIKED_PAGES_STORAGE_KEY,
        importerClass: OldLikedPagesImporter,
    },
    {
        storageKey: UNFOLLOWED_PAGES_STORAGE_KEY,
        importerClass: OldUnfollowedPagesImporter,
    },
    {
        storageKey: RECOMMENDED_PAGES_STORAGE_KEY,
        importerClass: OldRecommendedPagesImporter,
    },
];

export const NUMBER_OF_IMPORTERS = Object.keys(dataImporters).length;
