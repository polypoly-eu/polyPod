import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
import ReportAnalysis from "./report-analysis.js";

export default class OffFacebookEventTypesAnalysis extends ReportAnalysis {
    get title() {
        return "Off-Facebook Event Types";
    }

    get reportData() {
        return this._offFacebookEventTypes;
    }

    async analyze({ facebookAccount }) {
        const offFacebookEventTypes = new Set();
        facebookAccount.forEachOffFacebookEvent((event) => {
            if (event.type) {
                offFacebookEventTypes.add(event.type);
            }
        });
        this._offFacebookEventTypes = [...offFacebookEventTypes];
        this.active = this._offFacebookEventTypes.length > 0;
    }

    render() {
        return (
            <BasicList
                title="Types of activities done off-Facebook!"
                items={this._offFacebookEventTypes}
            />
        );
    }
}
