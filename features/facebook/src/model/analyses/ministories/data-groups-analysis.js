import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class DataGroupsAnalysis extends RootAnalysis {
    get title() {
        return "Data Groups";
    }

    async analyze({ dataAccount }) {
        this._bubblesData = dataAccount.dataGroups.filter(
            ({ count }) => count > 0
        );
        this.active = this._bubblesData.length > 0;
    }
    renderSummary() {
        <BasicDataCountTable items={this._bubblesData} />;
    }
}
