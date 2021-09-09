import RootAnalysis from "./root-analysis.js";

export default class OffFacebookEventsAnalysis extends RootAnalysis {
    get title() {
        return "Off-Facebook Activity";
    }

    async analyze({ facebookAccount }) {
        this._companiesCount = facebookAccount.offFacebookCompaniesCount;
        this._eventsCount = facebookAccount.offFacebookEventsCount;
        this.active = this._companiesCount > 0;
    }

    render() {
        return `There are ${this._eventsCount} events from ${this._companiesCount} businesses and organizations you visit off of Facebook`;
    }
}
