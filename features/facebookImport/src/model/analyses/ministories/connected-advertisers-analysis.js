import RootAnalysis from "./root-analysis.js";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return "Connected Advertisers";
    }

    async analyze({ facebookAccount }) {
        this._connectedAdvertisersCount =
            facebookAccount.connectedAdvertisers.length;
        this.active = this._connectedAdvertisersCount > 0;
    }

    renderSummary() {
        return `There are ${this._connectedAdvertisersCount} advertisers who run
                ads using a contact list they uploaded that includes contact
                info you shared with them or with one of their data partners`;
    }
}
