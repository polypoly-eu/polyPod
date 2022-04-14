import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class DataStructureBubblesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        this._bubblesData = dataAccount.dataGroups.filter(
            ({ count }) => count > 0
        );

        this.active = this._bubblesData.length > 0;
    }
}
