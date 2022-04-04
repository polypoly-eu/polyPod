import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

export default class OffFacebookEventsTypesAnalysis extends RootAnalysis {
    get title() {
        return "Off-Facebook Events by Type";
    }

    async analyze({ dataAccount }) {
        this.active = dataAccount.offFacebookCompanies.length > 0;
        this._eventsTypeCountPairs = [];
        if (!this.active) {
            return;
        }

        this._eventsTypeCountPairs =
            groupOffFacebookEventsByType(dataAccount);
    }

    renderSummary() {
        <BasicDataCountTable items={this._eventsTypeCountPairs} />;
    }
}
