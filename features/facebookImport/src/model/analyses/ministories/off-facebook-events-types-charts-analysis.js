import React from "react";
import BarChart from "../../../components/dataViz/barChart.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

export default class OffFacebookEventsTypesChartAnalysis extends RootAnalysis {
    get title() {
        return "Off-Facebook Events by By Type Chart";
    }

    async analyze({ dataAccount }) {
        this.active = dataAccount.offFacebookCompanies.length > 0;
        this._eventsTypeCountPairs = [];
        if (!this.active) {
            return;
        }

        this._eventsTypeCountPairs = groupOffFacebookEventsByType(dataAccount);
    }

    renderSummary() {
        return <BarChart data={this._eventsTypeCountPairs} names="type" />;
    }
}
