function latestTimestamp(timestamps) {
    return timestamps.reduce(
        (maxim, current) => (current > maxim ? current : maxim),
        0
    );
}

const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
function filterForDurationInDays(timestamps, referenceTimestamp, daysCount) {
    const referenceDate = new Date(referenceTimestamp * 1000);
    return timestamps.filter((timestamp) => {
        const date = new Date(timestamp * 1000);
        const diffTime = Math.abs(referenceDate - date);
        const diffDays = Math.ceil(diffTime / MILISECONDS_IN_DAY);
        return diffDays < daysCount;
    });
}

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

    get fullSummary() {
        return {
            name: this.displayName,
            onFacebookTimestamps: this.onFacebookEventTimestamps,
            offFacebookTimestamps: this.offFacebookEventTimestamps,
        };
    }

    get last90DaysSummary() {
        const onFacebookTimestamps = this.onFacebookEventTimestamps;
        const offFacebookTimestamps = this.offFacebookEventTimestamps;
        const latestEvent = latestTimestamp([
            ...onFacebookTimestamps,
            ...offFacebookTimestamps,
        ]);
        return {
            name: this.displayName,
            onFacebookTimestamps: filterForDurationInDays(
                this.onFacebookEventTimestamps,
                latestEvent,
                90
            ),
            offFacebookTimestamps: filterForDurationInDays(
                this.offFacebookEventTimestamps,
                latestEvent,
                90
            ),
        };
    }
}
