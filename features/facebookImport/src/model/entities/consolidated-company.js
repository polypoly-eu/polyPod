import { filterForDurationInDays } from "../importers/utils/timestamps";

export default class ConsolidatedCompany {
    constructor(relatedFacebookAccount, offFacebookCompanies) {
        this._relatedFacebookAccount = relatedFacebookAccount;
        this._offFacebookCompanies = offFacebookCompanies;
<<<<<<< HEAD
=======

        this._cachedOnFacebookEventTimestamps = null;
        this._cachedOffFacebookEventTimestamps = null;
>>>>>>> main
    }

    get displayName() {
        return this._relatedFacebookAccount.displayName;
    }

    get onFacebookEventTimestamps() {
<<<<<<< HEAD
        return this._relatedFacebookAccount.relatedPosts
            .map((relatedPost) => relatedPost.viewedTimestamps)
            .flat();
    }

    get offFacebookEventTimestamps() {
        return this._offFacebookCompanies
=======
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
>>>>>>> main
            .map((offFacebookCompany) =>
                offFacebookCompany.events.map((event) => event.timestamp)
            )
            .flat();
<<<<<<< HEAD
=======
        return this._cachedOffFacebookEventTimestamps;
>>>>>>> main
    }

    get fullSummary() {
        return {
            name: this.displayName,
            onFacebookTimestamps: this.onFacebookEventTimestamps,
            offFacebookTimestamps: this.offFacebookEventTimestamps,
        };
    }

<<<<<<< HEAD
    last90DaysSummary(referenceTimestamp) {
=======
    summaryUpToDurationInDays(referenceTimestamp, daysCount) {
>>>>>>> main
        return {
            name: this.displayName,
            onFacebookTimestamps: filterForDurationInDays(
                this.onFacebookEventTimestamps,
                referenceTimestamp,
<<<<<<< HEAD
                90
=======
                daysCount
>>>>>>> main
            ),
            offFacebookTimestamps: filterForDurationInDays(
                this.offFacebookEventTimestamps,
                referenceTimestamp,
<<<<<<< HEAD
                90
            ),
        };
    }
=======
                daysCount
            ),
        };
    }

    last90DaysSummary(referenceTimestamp) {
        return this.summaryUpToDurationInDays(referenceTimestamp, 90);
    }
>>>>>>> main
}
