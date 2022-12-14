import RootAnalysis from "./root-analysis";

/**
 * An analysis that constructs data for a bubble chart from the previously
 * determined groups (or areas) of data in the account object.
 */
class DataStructureBubblesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        let bubblesData = dataAccount.dataGroups.filter(
            ({ count }) => count > 0
        );
        if (bubblesData.length > 0) {
            dataAccount.analyses.bubblesData = bubblesData;
        }
    }
}

export default DataStructureBubblesAnalysis;
