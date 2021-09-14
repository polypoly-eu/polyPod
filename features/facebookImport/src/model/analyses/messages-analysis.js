import React from "react";
import i18n from "../../i18n";
import RootAnalysis from "./root-analysis";

import BarChart from "../../components/dataViz/barChart.jsx";

export default class MessagesAnalysis extends RootAnalysis {
    get title() {
        return "Messages Summary";
    }

    async analyze({ facebookAccount }) {
        this._messagesThreadsData = [];
        this._messagesCount = 0;
        this.active = facebookAccount.messageThreadsCount > 0;
        if (!this.active) {
            return;
        }

        this._messagesCount = facebookAccount.messagesCount;
        this._messagesThreadsData = [];
        const usernames = new Set();
        facebookAccount.forEachMessageThread((messageThread) => {
            var wordCount = 0;
            var firstChatTimestamp = 0;
            var lastChatTimestamp = 0;

            messageThread.messages.forEach((message) => {
                if (message?.sender_name) {
                    usernames.add(message.sender_name);
                }

                if (!message?.content) {
                    return;
                }

                const content = message.content;
                const words = content.match(/\b(\w+)\b/g);
                wordCount += words ? words.length : 1;

                if (
                    firstChatTimestamp === 0 ||
                    (firstChatTimestamp !== 0 &&
                        message.timestamp_ms < firstChatTimestamp)
                ) {
                    firstChatTimestamp = message.timestamp_ms;
                }
                if (message.timestamp_ms > lastChatTimestamp) {
                    lastChatTimestamp = message.timestamp_ms;
                }
            });

            const firstChatDate =
                firstChatTimestamp !== 0 ? new Date(firstChatTimestamp) : null;
            const lastChatDate =
                lastChatTimestamp !== 0 ? new Date(lastChatTimestamp) : null;

            this._messagesThreadsData.push({
                title: messageThread.title,
                count: messageThread.messages.length,
                extraData: {
                    wordCount,
                    firstChatDate,
                    lastChatDate,
                },
            });

            this._messagesThreadsData.sort((a, b) => b.count - a.count);

            this._totalUsernamesCount = usernames.size;
        });
    }

    renderSummary() {
        return (
            <p>
                In your export there are {this._messagesCount} messages in{" "}
                {this._messagesThreadsData.length} threads by{" "}
                {this._totalUsernamesCount} people.
            </p>
        );
    }

    renderDetails() {
        return (
            <>
                <p>
                    {i18n.t("messagesMinistory:number.chats", {
                        number_chats: this._totalUsernamesCount,
                    })}
                </p>
                <BarChart
                    data={this._messagesThreadsData}
                    screenPadding={48}
                    footerContent={({ extraData }) => (
                        <>
                            <div className="bar-extra-info">
                                {i18n.t("messagesMinistory:first.chat")}
                                {extraData.firstChatDate
                                    ? extraData.firstChatDate.toDateString()
                                    : "unknown"}
                            </div>
                            <div className="bar-extra-info">
                                {i18n.t("messagesMinistory:last.interaction")}
                                {extraData.lastChatDate
                                    ? extraData.lastChatDate.toDateString()
                                    : "unknown"}
                            </div>
                        </>
                    )}
                />
            </>
        );
    }
}
