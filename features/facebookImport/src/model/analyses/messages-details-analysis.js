import React from "react";
import RootAnalysis from "./root-analysis";

export default class MessagesDetailsAnalysis extends RootAnalysis {
    get title() {
        return "Messages Details";
    }

    async analyze({ facebookAccount }) {
        this.active = facebookAccount.hasMessages;
        this._wordCount = 0;
        this._callsCount = 0;
        this._messageThreadsCount = 0;
        this._messagesCount = 0;
        this._totalNumberOfBookPages = 0;
        this._callsDuration = 0;
        if (!this.active) {
            return;
        }

        this._messageThreadsCount = facebookAccount.messageThreadsCount;
        this._messagesCount = facebookAccount.messagesCount;

        const usernames = new Set();
        facebookAccount.forEachMessageThread((messageThread) => {
            for (let participant of messageThread.participants) {
                usernames.add(participant);
            }

            this._callsCount += messageThread.callsCount;
            this._callsDuration += messageThread.callsDuration;

            this._wordCount += messageThread.totalWordCount;
        });

        this._totalNumberOfBookPages = Math.round(this._wordCount / 500);
    }

    renderSummary() {
        return (
            <div>
                <p>
                    In your messages there are {this._wordCount} words. This
                    amounts to a book with {this._totalNumberOfBookPages + " "}
                    pages, considering on average 500 words per page.
                </p>
                <p>
                    You made {this._callsCount} calls lasting{" "}
                    {Math.floor(this._callsDuration / (24 * 3600))} days{" "}
                    {Math.floor(this._callsDuration / 3600) -
                        24 * Math.floor(this._callsDuration / (24 * 3600))}{" "}
                    hours.
                </p>
            </div>
        );
    }
}
