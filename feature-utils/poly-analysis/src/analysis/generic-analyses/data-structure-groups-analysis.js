import RootAnalysis from "../root-analysis";

export default class DataStructureGroupsAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        let structureGroups = dataAccount.dataGroups.filter(
            ({ count }) => count > 0
        );

        if (structureGroups.length > 0) {
            dataAccount.processedData.structureGroups = structureGroups;
        }
    }
}
