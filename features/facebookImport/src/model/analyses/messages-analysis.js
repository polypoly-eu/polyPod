import React from "react";
import RootAnalysis from "./root-analysis";

export default class MessagesAnalysis extends RootAnalysis {
    get title() {
        return "Messages Summary";
    }

    async analyze({ facebookAccount }) {
        this._messageThreadsCount = facebookAccount.messageThreads.length;
        this._messagesCount = facebookAccount.messagesCount;

        const usernames = new Set();
        facebookAccount.forEachMessage((message) => {
            if (message?.sender_name) {
                usernames.add(message.sender_name);
            }
        });
        this._totalUsernamesCount = usernames.size;
        this.active = this._messagesCount > 0;
    }

    renderSummary() {
        return (
            <p>
                In your export there are {this._messagesCount} messages in{" "}
                {this._messageThreadsCount} threads by{" "}
                {this._totalUsernamesCount} people.
            </p>
        );
    }
}
