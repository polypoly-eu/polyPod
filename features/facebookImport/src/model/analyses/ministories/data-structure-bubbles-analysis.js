import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class DataStructureBubblesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        let bubblesData = dataAccount.dataGroups.filter(
            ({ count }) => count > 0
        );

        if (bubblesData.length > 0) {
            dataAccount.processedData._bubblesData = bubblesData;
        }
    }
}
