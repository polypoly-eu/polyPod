import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../../analysisKeys";

export default class DataStructureBubblesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        let bubblesData = dataAccount.dataGroups.filter(
            ({ count }) => count > 0
        );

        if (bubblesData.length > 0) {
            dataAccount.analyses[analysisKeys.bubblesData] = bubblesData;
        }
    }
}
