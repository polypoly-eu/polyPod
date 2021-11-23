import { findLatestTimestamp } from "../importers/utils/timestamps";
import Entity from "./entity";

export default class RelatedPost extends Entity {
    constructor(url) {
        super();
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

    get viewedTimestamps() {
        return this._viewedTimestamps;
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

    get latestEventTimestamp() {
        return findLatestTimestamp(this._viewedTimestamps);
    }
}
