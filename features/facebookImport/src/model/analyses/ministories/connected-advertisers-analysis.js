import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        this._connectedAdvertisersCount =
            dataAccount.connectedAdvertisers.length;
        this._connectedAdvertiserNames = dataAccount.connectedAdvertisers.map(
            (connectedAdvertiser) => connectedAdvertiser.name
        );
        this.active = this._connectedAdvertisersCount > 0;
    }
}
