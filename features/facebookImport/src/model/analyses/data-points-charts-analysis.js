import React from "react";
import BarChart from "../../components/dataViz/barChart.jsx";
import RootAnalysis from "./root-analysis.js";

export default class DataChartsAnalysis extends RootAnalysis {
    get title() {
        return "Data Charts";
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
        return <BarChart data={this._bubblesData} />;
    }
}
