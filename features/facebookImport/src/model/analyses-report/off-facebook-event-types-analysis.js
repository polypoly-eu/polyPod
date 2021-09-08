import React from "react";
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
            if (!event.type) {
                return;
            }
            const eventType = event.type.toLowerCase();
            if (!this._offFacebookEventTypes.includes(eventType)) {
                this._offFacebookEventTypes.push(eventType);
            }
        });
    }

    render() {
        if (!this.active) {
            return "No off-facebook events detected in your export!";
        }
        return (
            <>
                Types of activities done off-Facebook!
                <ul>
                    {this._offFacebookEventTypes.map((entry, index) => (
                        <li key={index}>{entry}</li>
                    ))}
                </ul>
            </>
        );
    }
}
