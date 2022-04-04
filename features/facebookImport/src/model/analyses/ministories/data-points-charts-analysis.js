import React from "react";
import BarChart from "../../../components/dataViz/barChart.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

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
        return <BarChart data={this._bubblesData} />;
    }
}
