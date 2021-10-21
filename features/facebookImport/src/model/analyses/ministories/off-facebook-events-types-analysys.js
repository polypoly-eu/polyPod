import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import RootAnalysis from "./root-analysis.js";
import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

export default class OffFacebookEventsTypesAnalysis extends RootAnalysis {
    get title() {
        return "Off-Facebook Events by Type";
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
        <BasicDataCountTable items={this._eventsTypeCountPairs} />;
    }
}
