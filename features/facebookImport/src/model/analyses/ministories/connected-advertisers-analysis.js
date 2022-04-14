import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../../analysisKeys";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.analyses[analysisKeys.connectedAdvertisersCount] =
            dataAccount.connectedAdvertisers.length;
        this.analyses[analysisKeys.connectedAdvertiserNames] =
            dataAccount.connectedAdvertisers.map(
                (connectedAdvertiser) => connectedAdvertiser.name
            );
    }
}
