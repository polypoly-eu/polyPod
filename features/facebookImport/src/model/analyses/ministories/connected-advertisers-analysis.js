import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        if (dataAccount.connectedAdvertisers.length === 0) return;
        dataAccount.analyses[analysisKeys.connectedAdvertisersCount] =
            dataAccount.connectedAdvertisers.length;
        dataAccount.analyses[analysisKeys.connectedAdvertiserNames] =
            dataAccount.connectedAdvertisers.map(
                (connectedAdvertiser) => connectedAdvertiser.name
            );
    }
}
