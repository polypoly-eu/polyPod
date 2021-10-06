export default class RelatedPost {
    constructor({ url }) {
        this._url = url;
        this._isAd = false;
        this._viewedTimestamps = [];
    }

    get url() {
        return this._url;
    }

    get isAd() {
        return this._isAd;
    }

    get viewsCount() {
        return this._viewedTimestamps.length;
    }

    markAsAd() {
        this._isAd = true;
    }

    addViewTimestamp(timestamp) {
        this._viewedTimestamps.push(timestamp);
    }
}
