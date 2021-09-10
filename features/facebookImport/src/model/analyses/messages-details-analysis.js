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

        this._messageThreadsCount = facebookAccount.messageThreads.length;
        this._messagesCount = facebookAccount.messagesCount;

        const usernames = new Set();
        facebookAccount.forEachMessage((message) => {
            if (!message?.content) {
                return;
            }
            if (message?.sender_name) {
                usernames.add(message.sender_name);
            }
            if (message?.type === "Call") {
                //debugger;
                this._callsCount++;
                this._callsDuration += message.call_duration;
            }

            const content = message.content;
            const words = content.match(/\b(\w+)\b/g);
            this._wordCount += words ? words.length : 1;
            return message;
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
