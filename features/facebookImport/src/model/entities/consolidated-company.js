import { filterForDurationInDays } from "../importers/utils/timestamps";

export default class ConsolidatedCompany {
    constructor(relatedFacebookAccount, offFacebookCompanies) {
        this._relatedFacebookAccount = relatedFacebookAccount;
        this._offFacebookCompanies = offFacebookCompanies;

        this._cachedOnFacebookEventTimestamps = null;
        this._cachedOffFacebookEventTimestamps = null;
    }

    get displayName() {
        return this._relatedFacebookAccount.displayName;
    }

    get onFacebookEventTimestamps() {
        if (this._cachedOnFacebookEventTimestamps) {
            return this._cachedOnFacebookEventTimestamps;
        }
        this._cachedOnFacebookEventTimestamps =
            this._relatedFacebookAccount.relatedPosts
                .map((relatedPost) => relatedPost.viewedTimestamps)
                .flat();
        return this._cachedOnFacebookEventTimestamps;
    }

    get offFacebookEventTimestamps() {
        if (this._cachedOffFacebookEventTimestamps) {
            return this._cachedOffFacebookEventTimestamps;
        }
        this._cachedOffFacebookEventTimestamps = this._offFacebookCompanies
            .map((offFacebookCompany) =>
                offFacebookCompany.events.map((event) => event.timestamp)
            )
            .flat();
        return this._cachedOffFacebookEventTimestamps;
    }

    get fullSummary() {
        return {
            name: this.displayName,
            onFacebookTimestamps: this.onFacebookEventTimestamps,
            offFacebookTimestamps: this.offFacebookEventTimestamps,
        };
    }

    summaryUpToDurationInDays(referenceTimestamp, daysCount) {
        return {
            name: this.displayName,
            onFacebookTimestamps: filterForDurationInDays(
                this.onFacebookEventTimestamps,
                referenceTimestamp,
                daysCount
            ),
            offFacebookTimestamps: filterForDurationInDays(
                this.offFacebookEventTimestamps,
                referenceTimestamp,
                daysCount
            ),
        };
    }

    last90DaysSummary(referenceTimestamp) {
        return this.summaryUpToDurationInDays(referenceTimestamp, 90);
    }
}
