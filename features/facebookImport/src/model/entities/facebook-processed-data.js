export default class FacebookProcessedData {
    constructor() {
        let self = this;
        this.picturesCount = null;
        this.totalEvents = null;
        this.locationsData = null;
        this.randomAdInterests = null;
        this.numberInterests = null;
        this.displayData = null;
        this.reactionsTypeCountPairs = null;
        this.messagesThreadsData = null;
        this.totalUsernamesCount = null;
        this.messagesCount = null;
        this.offFacebookEventTypes = null;
        this.onOffEvents = null;
        this.companiesCount = null;
        this.companiesWithAdsCount = null;
        this.commonAdvertisersData = null;
        this.connectedAdvertisersCount = null;
        this.connectedAdvertiserNames = null;
        this.postReactionsTypes = null;
        this.eventsTypeCountPairs = null;
        this.bubblesData = null;
        this.sortedAdInterests = null;

        const attributes = [
            "picturesCount",
            "totalEvents",
            "locationsData",
            "randomAdInterests",
            "numberInterests",
            "displayData",
            "reactionsTypeCountPairs",
            "messagesThreadsData",
            "totalUsernamesCount",
            "messagesCount",
            "offFacebookEventTypes",
            "onOffEvents",
            "companiesCount",
            "companiesWithAdsCount",
            "commonAdvertisersData",
            "connectedAdvertisersCount",
            "connectedAdvertiserNames",
            "postReactionsTypes",
            "eventsTypeCountPairs",
            "bubblesData",
            "sortedAdInterests",
        ];

        //setters & getters
        attributes.forEach(function (attribute) {
            Object.defineProperty(self, attribute, {
                get: function () {
                    return self["_" + attribute];
                },
                set: function (value) {
                    self["_" + attribute] = value;
                },
            });
        });
    }
}
