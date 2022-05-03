import { ProcessedData } from "@polypoly-eu/poly-import";

export default class FacebookProcessedData extends ProcessedData {
    constructor() {
        super();
        let self = this;
        this._picturesCount = null;
        this._totalEvents = null;
        this._locationsData = null;
        this._randomAdInterests = null;
        this._numberInterests = null;
        this._displayData = null;
        this._reactionsTypeCountPairs = null;
        this._messagesThreadsData = null;
        this._totalUsernamesCount = null;
        this._messagesCount = null;
        this._offFacebookEventTypes = null;
        this._onOffEvents = null;
        this._companiesCount = null;
        this._companiesWithAdsCount = null;
        this._commonAdvertisersData = null;
        this._connectedAdvertisersCount = null;
        this._connectedAdvertiserNames = null;
        this._postReactionsTypes = null;
        this._eventsTypeCountPairs = null;
        this._bubblesData = null;
        this._sortedAdInterests = null;

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
