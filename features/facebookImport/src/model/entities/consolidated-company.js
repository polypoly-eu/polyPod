import {
    filterForDurationInDays,
    latestTimestamp,
} from "../importers/utils/timestamps";

export default class ConsolidatedCompany {
    constructor(relatedFacebookAccount, offFacebookCompanies) {
        this._relatedFacebookAccount = relatedFacebookAccount;
        this._offFacebookCompanies = offFacebookCompanies;
    }

    get displayName() {
        return this._relatedFacebookAccount.displayName;
    }

    get onFacebookEventTimestamps() {
        return this._relatedFacebookAccount.relatedPosts
            .map((relatedPost) => relatedPost.viewedTimestamps)
            .flat();
    }

    get offFacebookEventTimestamps() {
        return this._offFacebookCompanies
            .map((offFacebookCompany) =>
                offFacebookCompany.events.map((event) => event.timestamp)
            )
            .flat();
    }

    get latestEventTimestamp() {
        return latestTimestamp([
            ...this.onFacebookEventTimestamps,
            ...this.offFacebookEventTimestamps,
        ]);
    }

    get fullSummary() {
        return {
            name: this.displayName,
            onFacebookTimestamps: this.onFacebookEventTimestamps,
            offFacebookTimestamps: this.offFacebookEventTimestamps,
        };
    }

    last90DaysSummary(referenceTimestamp) {
        return {
            name: this.displayName,
            onFacebookTimestamps: filterForDurationInDays(
                this.onFacebookEventTimestamps,
                referenceTimestamp,
                90
            ),
            offFacebookTimestamps: filterForDurationInDays(
                this.offFacebookEventTimestamps,
                referenceTimestamp,
                90
            ),
        };
    }
}
