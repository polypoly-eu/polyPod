import React from "react";
import i18n from "../../i18n";
import RootAnalysis from "./root-analysis";

export default class MessagesAnalysis extends RootAnalysis {
    get title() {
        return "Messages Summary";
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
            <p>
                In your export there are {this._messagesCount} messages in{" "}
                {this._messageThreadsCount} threads by{" "}
                {this._totalUsernamesCount} people.
            </p>
        );
    }

    renderDetails() {
        return (
            <>
                <p>{i18n.t("messengesMinistory:number.chats")}</p>
            </>
        );
    }
}
