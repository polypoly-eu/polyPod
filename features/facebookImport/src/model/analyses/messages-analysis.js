import React from "react";
import i18n from "../../i18n";
import RootAnalysis from "./root-analysis";

import BarChart from "../../components/dataViz/barChart.jsx";

export default class MessagesAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("explore:messages.title");
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

                const words = message.content.match(/\b(\w+)\b/g);
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
                {i18n.t("explore:messages.summary", {
                    messages: this._messagesCount,
                    threads: this._messagesThreadsData.length,
                    people: this._totalUsernamesCount,
                })}
            </p>
        );
    }

    renderDetails() {
        return (
            <>
                <p>
                    {i18n.t("messagesMiniStory:number.chats", {
                        number_chats: this._totalUsernamesCount,
                    })}
                </p>
                <BarChart
                    data={this._messagesThreadsData}
                    screenPadding={48}
                    footerContent={({ extraData }) => (
                        <>
                            <div className="bar-extra-info">
                                {i18n.t("messagesMiniStory:first.chat")}
                                {extraData.firstChatDate
                                    ? extraData.firstChatDate.toDateString()
                                    : "unknown"}
                            </div>
                            <div className="bar-extra-info">
                                {i18n.t("messagesMiniStory:last.interaction")}
                                {extraData.lastChatDate
                                    ? extraData.lastChatDate.toDateString()
                                    : "unknown"}
                            </div>
                        </>
                    )}
                />
                <p className="source">
                    {i18n.t("common:source.your.facebook.data")}
                </p>
            </>
        );
    }
}
