import React from "react";
import ReportAnalysis from "./report-analysis";

const knownMessageTypes = [
    "generic",
    "share",
    "call",
    "subscribe",
    "unsubscribe",
];

export default class UnknownMessageTypesAnalysis extends ReportAnalysis {
    get title() {
        return "Unknown Message Types";
    }

    get jsonReport() {
        return {
            id: this.id,
            unknownMessageTypes: this._unknownMessageTypes,
        };
    }

    async analyze({ facebookAccount }) {
        this.active = facebookAccount.messagesCount > 0;
        this._unknownMessageTypes = new Set();
        if (!this.active) {
            return;
        }

        facebookAccount.forEachMessage((message) => {
            if (!message.type) {
                return;
            }
            const messageType = message.type.toLowerCase();
            if (knownMessageTypes.includes(messageType)) {
                return;
            }

            this._unknownMessageTypes.add(messageType);
        });
        this.active = this._unknownMessageTypes.size > 0;
    }

    render() {
        return (
            <ul>
                {[...this._unknownMessageTypes].map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        );
    }
}
