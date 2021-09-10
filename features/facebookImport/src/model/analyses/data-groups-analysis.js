import React from "react";
import BasicDataCountTable from "../../components/basicDataCountTable/basicDataCountTable.jsx";
import RootAnalysis from "./root-analysis";

export default class DataGroupsAnalysis extends RootAnalysis {
    get title() {
        return "Data Groups";
    }

    async analyze({ facebookAccount }) {
        this._bubblesData = facebookAccount.dataGroups.filter(
            ({ count }) => count > 0
        );
        this.active = this._bubblesData.length > 0;
    }

    renderSummary() {
        if (!this.active) {
            return "No Data!";
        }

        <BasicDataCountTable items={this._bubblesData} />;
    }
}
