import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";
import ReportAnalysis from "./report-analysis.js";

export default class OffFacebookEventTypesAnalysis extends ReportAnalysis {
    get title() {
        return "Off-Facebook Event Types";
    }

    get jsonReport() {
        return {
            id: this.id,
            offFacebookEventTypes: this._offFacebookEventTypes,
        };
    }

    async analyze({ facebookAccount }) {
        this.active = facebookAccount.offFacebookEventsCount > 0;
        this._offFacebookEventTypes = new Set();

        if (!this.active) {
            return;
        }

        facebookAccount.forEachOffFacebookEvent((event) => {
            if (event.type) {
                this._offFacebookEventTypes.add(event.type);
            }
        });
        this.active = this._offFacebookEventTypes.size > 0;
    }

    render() {
        if (!this.active) {
            return "No off-facebook events detected in your export!";
        }
        return (
            <BasicList
                title="Types of activities done off-Facebook!"
                items={[...this._offFacebookEventTypes]}
            />
        );
    }
}
