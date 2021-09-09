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
        this._unknownMessageTypes = [];
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
            if (!this._unknownMessageTypes.includes(messageType)) {
                this._unknownMessageTypes.push(messageType);
            }
        });
        this.active = this._unknownMessageTypes.length > 0;
    }

    render() {
        if (!this.active) {
            return "No unknown message types!";
        }
        return (
            <ul>
                {this._unknownMessageTypes.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        );
    }
}
