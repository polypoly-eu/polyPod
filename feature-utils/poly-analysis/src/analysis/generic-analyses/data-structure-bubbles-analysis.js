import RootAnalysis from "../root-analysis";

export default class DataStructureBubblesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        let bubblesData = dataAccount.dataGroups.filter(
            ({ count }) => count > 0
        );

        if (bubblesData.length > 0) {
            dataAccount.analyses.bubblesData = bubblesData;
        }
    }
}
