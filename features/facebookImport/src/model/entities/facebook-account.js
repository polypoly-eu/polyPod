import i18n from "../../i18n.js";
import Entity from "./entity.js";
import MessageThreadsGroup from "./message-threads-group.js";
import RelatedAccountsGroup from "./related-accounts-group.js";

class FacebookAccount extends Entity {
    constructor() {
        super();
        this._basePolyPodVersion = null;
        this._importingResults = [];
        this._importedFileNames = [];

        this._name = "";
        this._preferredLanguage = [];

        this._offFacebookCompanies = [];
        this._adInterests = [];
        this._connectedAdvertisers = [];
        this._interactedAdvertisers = [];
        this._friends = [];
        this._receivedFriendRequests = [];
        this._followedPages = [];
        this._likedPages = [];
        this._recommendedPages = [];
        this._unfollowedPages = [];
        this._searches = [];
        this._adminRecords = [];
        this._accountSessionActivities = [];
        this._comments = [];
        this._postReactions = [];
        this._posts = [];

        this._messageThreadsGroup = new MessageThreadsGroup();
        this._relatedAccounts = new RelatedAccountsGroup();
    }

    get importedFileNames() {
        return this._importedFileNames;
    }

    addImportedFileName(fileName) {
        this._importedFileNames.push(fileName);
    }

    get importingResults() {
        return this._importingResults;
    }

    set importingResults(importingResults) {
        this._importingResults = importingResults;
    }

    get offFacebookCompaniesCount() {
        return this._offFacebookCompanies.length;
    }

    get offFacebookEventsCount() {
        return this.offFacebookCompanies.reduce((total, company) => {
            if (company?.events) {
                return total + company.events.length;
            }
            return total;
        }, 0);
    }

    get offFacebookEventsLatestTimestamp() {
        let latestTimestamp = 0;
        this.forEachOffFacebookEvent((event) => {
            if (event.timestamp > latestTimestamp) {
                latestTimestamp = event.timestamp;
            }
        });
        return latestTimestamp;
    }

    get relatedAccountEventLatestTimestamp() {
        return this.relatedAccounts.latestEventTimestamp;
    }

    get messageThreadsGroup() {
        return this._messageThreadsGroup;
    }

    get messageThreadsCount() {
        return this._messageThreadsGroup.messageThreadsCount;
    }

    get messagesCount() {
        return this._messageThreadsGroup.messagesCount;
    }

    get hasMessages() {
        return this._messageThreadsGroup.hasMessages;
    }

    forEachMessageThread(callback) {
        this._messageThreadsGroup.forEachMessageThread(callback);
    }

    forEachOffFacebookEvent(callback) {
        for (const offFacebookCompany of this.offFacebookCompanies) {
            for (const offFacebookEvent of offFacebookCompany?.events || []) {
                callback(offFacebookEvent);
            }
        }
    }

    addRelatedAccounts(relatedAccounts) {
        this._relatedAccounts.addAll(relatedAccounts);
    }

    // Basic accessors

    get basePolyPodVersion() {
        return this._basePolyPodVersion;
    }

    set basePolyPodVersion(basePolyPodVersion) {
        this._basePolyPodVersion = basePolyPodVersion;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get preferredLanguage() {
        return this._preferredLanguage;
    }

    set preferredLanguage(preferredLanguage) {
        this._preferredLanguage = preferredLanguage;
    }

    get offFacebookCompanies() {
        return this._offFacebookCompanies;
    }

    set offFacebookCompanies(companies) {
        this._offFacebookCompanies = companies;
    }

    get adInterests() {
        return this._adInterests;
    }

    set adInterests(adInterests) {
        this._adInterests = adInterests;
    }

    get connectedAdvertisers() {
        return this._connectedAdvertisers;
    }

    set connectedAdvertisers(connectedAdvertisers) {
        this._connectedAdvertisers = connectedAdvertisers;
    }

    get interactedAdvertisers() {
        return this._interactedAdvertisers;
    }

    set interactedAdvertisers(interactedAdvertisers) {
        this._interactedAdvertisers = interactedAdvertisers;
    }

    get friends() {
        return this._friends;
    }

    set friends(friends) {
        this._friends = friends;
    }

    get followedPages() {
        return this._followedPages;
    }

    set followedPages(followedPages) {
        this._followedPages = followedPages;
    }

    get likedPages() {
        return this._likedPages;
    }

    set likedPages(likedPages) {
        this._likedPages = likedPages;
    }

    get recommendedPages() {
        return this._recommendedPages;
    }

    set recommendedPages(recommendedPages) {
        this._recommendedPages = recommendedPages;
    }

    get unfollowedPages() {
        return this._unfollowedPages;
    }

    set unfollowedPages(unfollowedPages) {
        this._unfollowedPages = unfollowedPages;
    }

    get receivedFriendRequests() {
        return this._receivedFriendRequests;
    }

    set receivedFriendRequests(receivedFriendRequests) {
        this._receivedFriendRequests = receivedFriendRequests;
    }

    get searches() {
        return this._searches;
    }

    set searches(searches) {
        this._searches = searches;
    }

    get adminRecords() {
        return this._adminRecords;
    }

    set adminRecords(adminRecords) {
        this._adminRecords = adminRecords;
    }

    get accountSessionActivities() {
        return this._accountSessionActivities;
    }

    set accountSessionActivities(accountSessionActivities) {
        this._accountSessionActivities = accountSessionActivities;
    }

    get relatedAccounts() {
        return this._relatedAccounts;
    }

    get relatedAccountsCount() {
        return this._relatedAccounts.count;
    }

    get comments() {
        return this._comments;
    }

    set comments(comments) {
        this._comments = comments;
    }

    get postReactions() {
        return this._postReactions;
    }

    set postReactions(postReactions) {
        this._postReactions = postReactions;
    }

    get posts() {
        return this._posts;
    }

    addPosts(newPosts) {
        this.posts.push(...newPosts);
    }

    get dataGroups() {
        return [
            {
                title: i18n.t("facebookAccount:connected-advertisers"),
                count: this.connectedAdvertisers.length,
            },
            {
                title: i18n.t("facebookAccount:interacted-with-advertisers"),
                count: this.interactedAdvertisers.length,
            },

            {
                title: i18n.t("facebookAccount:ad-interests"),
                count: this.adInterests.length,
            },

            {
                title: i18n.t("facebookAccount:off-facebook-activity"),
                count: this.offFacebookEventsCount,
            },

            {
                title: i18n.t("facebookAccount:friends"),
                count: this.friends.length,
            },

            {
                title: i18n.t("facebookAccount:followed-pages"),
                count: this.followedPages.length,
            },

            {
                title: i18n.t("facebookAccount:received-friend-requests"),
                count: this.receivedFriendRequests.length,
            },

            {
                title: i18n.t("facebookAccount:liked-pages"),
                count: this.likedPages.length,
            },

            {
                title: i18n.t("facebookAccount:recommended-pages"),
                count: this.recommendedPages.length,
            },

            {
                title: i18n.t("facebookAccount:unfollowed-pages"),
                count: this.unfollowedPages.length,
            },

            {
                title: i18n.t("facebookAccount:searches"),
                count: this.searches.length,
            },

            {
                title: i18n.t("facebookAccount:messages"),
                count: this.messagesCount,
            },

            {
                title: i18n.t("facebookAccount:admin-records"),
                count: this.adminRecords.length,
            },

            {
                title: i18n.t("facebookAccount:session-activities"),
                count: this.accountSessionActivities.length,
            },

            {
                title: i18n.t("facebookAccount:comments"),
                count: this.comments.length,
            },

            {
                title: i18n.t("facebookAccount:reactions"),
                count: this.postReactions.length,
            },

            {
                title: i18n.t("facebookAccount:posts"),
                count: this.posts.length,
            },
        ];
    }
}

export default FacebookAccount;
