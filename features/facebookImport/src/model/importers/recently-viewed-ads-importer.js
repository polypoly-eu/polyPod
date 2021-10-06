import RootAnalysis from "../analyses/ministories/root-analysis";
import RelatedAccount from "../entities/related-account";
import RelatedPost from "../entities/related-post";
import {
    extractNameFromAdDescription,
    localeForCategoyName,
} from "./utils/ads-locale";
import { readJSONDataArray } from "./utils/importer-util";
import { extractAccountDataFromUrl } from "./utils/url-processing";

export default class RecentlyViewedAdsImporter extends RootAnalysis {
    constructor() {
        super();
        this._accountsByUrl = new Map();
    }

    async _readRecentlyViewedData(id, zipFile) {
        return await readJSONDataArray(
            "your_interactions_on_facebook/recently_viewed.json",
            "recently_viewed",
            zipFile,
            id
        );
    }

    _ensureAd(adViewData, relatedAccount) {
        const adUrl = adViewData.data?.uri;
        const post = relatedAccount.postWithUrl(adUrl);
        if (post) {
            post.markAsAd();
            return post;
        }
        const newAd = new RelatedPost({ url: adUrl });
        newAd.markAsAd();
        relatedAccount.addRelatedPost(newAd);
        return newAd;
    }

    _ensureRelatedAccount(adData, currentLocale) {
        const accountData = extractAccountDataFromUrl(adData.uri);
        if (!accountData) {
            return;
        }

        if (this._accountsByUrl.has(accountData.url)) {
            return this._accountsByUrl.get(accountData.url);
        }
        const relatedAccount = new RelatedAccount(accountData);
        relatedAccount.displayName = extractNameFromAdDescription(
            adData.name,
            currentLocale
        );

        this._accountsByUrl.set(relatedAccount.url, relatedAccount);
        return relatedAccount;
    }

    _extractViewedAds(adsViewsData, currentLocale) {
        adsViewsData.entries.forEach((adViewData) => {
            const relatedAccount = this._ensureRelatedAccount(
                adViewData.data,
                currentLocale
            );
            if (relatedAccount) {
                const ad = this._ensureAd(
                    adViewData,
                    relatedAccount,
                    currentLocale
                );
                ad.addViewTimestamp(adViewData.timestamp);
            }
        });
    }

    async import({ id, zipFile }, facebookAccount) {
        const rawData = await this._readRecentlyViewedData(id, zipFile);
        const adsViewsData = rawData.find(
            (eachCategory) =>
                localeForCategoyName(eachCategory.name) !== undefined
        );
        if (adsViewsData) {
            const currentLocale = localeForCategoyName(adsViewsData.name);
            this._extractViewedAds(adsViewsData, currentLocale);

            facebookAccount.addRelatedAccounts(this._accountsByUrl.values());
        }
    }
}
