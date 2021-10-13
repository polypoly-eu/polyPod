export default class RelatedAccountsGroup {
    constructor() {
        this._relatedAccounts = [];
    }

    get count() {
        return this._relatedAccounts.length;
    }

    get items() {
        return this._relatedAccounts;
    }

    get adsCount() {
        return this._relatedAccounts.reduce(
            (total, relatedAccount) => total + relatedAccount.adsCount,
            0
        );
    }

    get adViewsCount() {
        return this._relatedAccounts.reduce(
            (total, relatedAccount) => total + relatedAccount.adViewsCount,
            0
        );
    }

    addAll(relatedAccounts) {
        for (const relatedAccount of relatedAccounts) {
            this._relatedAccounts.push(relatedAccount);
        }
    }

    advertisers() {
        return this._relatedAccounts.filter(
            (relatedAccount) => relatedAccount.hasAds
        );
    }

    get latestEventTimestamp() {
        return this._relatedAccounts.reduce(
            (latestTimestamp, relatedAccount) => {
                const currentTimestamp = relatedAccount.latestEventTimestamp;
                return currentTimestamp > latestTimestamp
                    ? currentTimestamp
                    : latestTimestamp;
            },
            0
        );
    }
}
