import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        if (dataAccount.connectedAdvertisers.length === 0) return;
        dataAccount.processedData._connectedAdvertisersCount =
            dataAccount.connectedAdvertisers.length;
        dataAccount.processedData._connectedAdvertiserNames =
            dataAccount.connectedAdvertisers.map(
                (connectedAdvertiser) => connectedAdvertiser.name
            );
    }
}
