import { DataAccount } from "@polypoly-eu/poly-import";
import i18n from "../../i18n.js";
import MessageThreadsGroup from "./message-threads-group.js";
import RelatedAccountsGroup from "./related-accounts-group.js";

class FacebookAccount extends DataAccount {
    constructor() {
        super();
        this.offFacebookCompanies = [];
        this.adInterests = [];
        this.connectedAdvertisers = [];
        this.interactedAdvertisers = [];
        this.friends = [];
        this.receivedFriendRequests = [];
        this.followedPages = [];
        this.likedPages = [];
        this.recommendedPages = [];
        this.unfollowedPages = [];
        this.searches = [];
        this.adminRecords = [];
        this.accountSessionActivities = [];
        this.comments = [];
        this.postReactions = [];
        this.posts = [];

        this.messageThreadsGroup = new MessageThreadsGroup();
        this.relatedAccounts = new RelatedAccountsGroup();
    }

    get offFacebookCompaniesCount() {
        return this.offFacebookCompanies.length;
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

    get relatedAccountsCount() {
        return this.relatedAccounts.count;
    }

    get relatedAccountEventLatestTimestamp() {
        return this.relatedAccounts.latestEventTimestamp;
    }

    get messageThreadsCount() {
        return this.messageThreadsGroup.messageThreadsCount;
    }

    get messagesCount() {
        return this.messageThreadsGroup.messagesCount;
    }

    get hasMessages() {
        return this.messageThreadsGroup.hasMessages;
    }

    forEachMessageThread(callback) {
        this.messageThreadsGroup.forEachMessageThread(callback);
    }

    forEachOffFacebookEvent(callback) {
        for (const offFacebookCompany of this.offFacebookCompanies) {
            for (const offFacebookEvent of offFacebookCompany?.events || []) {
                callback(offFacebookEvent);
            }
        }
    }

    addRelatedAccounts(relatedAccounts) {
        this.relatedAccounts.addAll(relatedAccounts);
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
