import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
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

    get reportData() {
        return this._unknownMessageTypes;
    }

    async analyze({ facebookAccount }) {
        const unknownMessageTypes = new Set();
        facebookAccount.forEachMessageThread((messageThread) => {
            for (let messageType of messageThread.messageTypes) {
                if (!knownMessageTypes.includes(messageType.toLowerCase())) {
                    unknownMessageTypes.add(messageType);
                }
            }
        });
        this._unknownMessageTypes = [...unknownMessageTypes];
        this.active = this._unknownMessageTypes.length > 0;
    }

    render() {
        return <BasicList items={this._unknownMessageTypes} />;
    }
}
