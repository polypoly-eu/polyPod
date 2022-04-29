import { ProcessedData } from "@polypoly-eu/poly-import";

export default class FacebookProcessedData extends ProcessedData {
    constructor() {
        super();
        this._picturesCount = null;
        this._totalEvents = null;
        this._locationsData = null;
        this._randomAdInterests = null;
        this._sortedAdInterests = null;
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
    }
}
