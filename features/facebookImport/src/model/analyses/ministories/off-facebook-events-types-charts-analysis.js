import React from "react";
import BarChart from "../../../components/dataViz/barChart.jsx";
import RootAnalysis from "./root-analysis.js";
import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

export default class OffFacebookEventsTypesChartAnalysis extends RootAnalysis {
    get title() {
        return "Off-Facebook Events by By Type Chart";
    }

    async analyze({ facebookAccount }) {
        this.active = facebookAccount.offFacebookCompanies.length > 0;
        this._eventsTypeCountPairs = [];
        if (!this.active) {
            return;
        }

        this._eventsTypeCountPairs =
            groupOffFacebookEventsByType(facebookAccount);
    }

    renderSummary() {
        return <BarChart data={this._eventsTypeCountPairs} names="type" />;
    }
}
