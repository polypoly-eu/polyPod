import RootAnalysis from "./root-analysis.js";

export default class OffFacebookEventsAnalysis extends RootAnalysis {
    get title() {
        return "Off-Facebook Activity";
    }

    async parse({ facebookAccount }) {
        this._companiesCount = facebookAccount.offFacebookCompaniesCount;
        this._eventsCount = facebookAccount.offFacebookEventsCount;
        this.active = this._companiesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No off-facebook events detected in your export!";
        }
        return `There are ${this._eventsCount} events from ${this._companiesCount} businesses and organizations you visit off of Facebook`;
    }
}
