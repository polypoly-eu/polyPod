class FacebookAccount {
    constructor() {
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
        this._messageThreads = [];
    }

    get pod() {
        return this._pod;
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

    get messagesCount() {
        return this.messageThreads.reduce((total, messageThread) => {
            if (messageThread?.messages) {
                return total + messageThread.messages.length;
            }
            return total;
        }, 0);
    }

    // Basic accessors

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

    get messageThreads() {
        return this._messageThreads;
    }

    set messageThreads(messageThreads) {
        this._messageThreads = messageThreads;
    }

    get dataGroups() {
        return [
            {
                title: "Connected Advertisers",
                count: this.connectedAdvertisers.length,
            },
            {
                title: "Interacted with Advertisers",
                count: this.interactedAdvertisers.length,
            },

            {
                title: "Ad Interests",
                count: this.adInterests.length,
            },

            {
                title: "Off-Facebook Activity",
                count: this.offFacebookEventsCount,
            },

            {
                title: "Friends",
                count: this.friends.length,
            },

            {
                title: "Followed Pages",
                count: this.followedPages.length,
            },

            {
                title: "Received Friend Requests",
                count: this.receivedFriendRequests.length,
            },

            {
                title: "Liked Pages",
                count: this.likedPages.length,
            },

            {
                title: "Recommended Pages",
                count: this.recommendedPages.length,
            },

            {
                title: "Unfollowed Pages",
                count: this.unfollowedPages.length,
            },

            {
                title: "Searches",
                count: this.searches.length,
            },

            {
                title: "Messages",
                count: this.messagesCount,
            },
        ];
    }
}

export default FacebookAccount;
