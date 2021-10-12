export default class RelatedAccount {
    constructor({ url, urlId, rawId }) {
        this._url = url;
        this._urlId = urlId;
        this._rawId = rawId;
        this._relatedPosts = [];
    }

    get url() {
        return this._url;
    }

    get urlId() {
        return this._urlId;
    }

    get rawId() {
        return this._rawId;
    }

    get displayName() {
        return this._displayName;
    }

    set displayName(displayName) {
        this._displayName = displayName;
    }

    get relatedPosts() {
        return this._relatedPosts;
    }

    get hasAds() {
        return this.adsCount > 0;
    }

    get adsCount() {
        return this._relatedPosts.reduce(
            (total, post) => (post.isAd ? total + 1 : total),
            0
        );
    }

    get adViewsCount() {
        return this._relatedPosts.reduce(
            (total, post) => (post.isAd ? total + post.viewsCount : total),
            0
        );
    }

    postWithUrl(url) {
        return this._relatedPosts.find((post) => post.url === url);
    }

    addRelatedPost(newPost) {
        this._relatedPosts.push(newPost);
    }

    get latestEventTimestamp() {
        return this._relatedPosts.reduce((latestTimestamp, relatedPost) => {
            const currentTimestamp = relatedPost.latestEventTimestamp;
            return currentTimestamp > latestTimestamp
                ? currentTimestamp
                : latestTimestamp;
        }, 0);
    }
}
