import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
import { ReportAnalysis } from "@polypoly-eu/poly-analysis";

export default class OffFacebookEventTypesAnalysis extends ReportAnalysis {
    get title() {
        return "Off-Facebook Event Types";
    }

    get reportData() {
        return this._offFacebookEventTypes;
    }

    async analyze({ dataAccount }) {
        const offFacebookEventTypes = new Set();
        dataAccount.forEachOffFacebookEvent((event) => {
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
