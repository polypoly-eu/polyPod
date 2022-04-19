import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.analyses[analysisKeys.connectedAdvertiserNames] =
            dataAccount.connectedAdvertisers.map(
                (connectedAdvertiser) => connectedAdvertiser.name
            );
    }
}
