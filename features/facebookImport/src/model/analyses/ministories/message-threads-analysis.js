import React from "react";
import BarChart from "../../../components/dataViz/barChart.jsx";
import RootAnalysis from "./root-analysis";

export default class MessageThreadsAnalysis extends RootAnalysis {
    get title() {
        return "Message threads";
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
        facebookAccount.forEachMessageThread((messageThread) => {
            var wordCount = messageThread.totalWordCount;
            var firstChatTimestamp = 0;
            var lastChatTimestamp = 0;

            messageThread.forEachMessageTimestamp((messageTimestamp_ms) => {
                if (
                    firstChatTimestamp === 0 ||
                    (firstChatTimestamp !== 0 &&
                        messageTimestamp_ms < firstChatTimestamp)
                ) {
                    firstChatTimestamp = messageTimestamp_ms;
                }
                if (messageTimestamp_ms > lastChatTimestamp) {
                    lastChatTimestamp = messageTimestamp_ms;
                }
            });

            const firstChatDate =
                firstChatTimestamp !== 0 ? new Date(firstChatTimestamp) : null;
            const lastChatDate =
                lastChatTimestamp !== 0 ? new Date(lastChatTimestamp) : null;

            this._messagesThreadsData.push({
                title: messageThread.title,
                count: messageThread.messagesCount,
                extraData: {
                    wordCount,
                    firstChatDate,
                    lastChatDate,
                },
            });

            this._messagesThreadsData.sort((a, b) => b.count - a.count);
            this._messagesThreadsData = this._messagesThreadsData.slice(0, 10);
        });
    }

    renderSummary() {
        return (
            <>
                <p>
                    Your Facebook data also contains all your chats from
                    Facebook Messenger: {this._messagesCount} messages. Here is
                    the list of your top 10 chats by the number of messages.
                </p>
                <BarChart
                    data={this._messagesThreadsData}
                    footerContent={({ count, extraData }) => (
                        <>
                            <div className="bar-extra-info">
                                {count} {count === 1 ? "message" : "messages"}{" "}
                                having {extraData.wordCount} words
                            </div>
                            <div className="bar-extra-info">
                                First chat:{" "}
                                {extraData.firstChatDate
                                    ? extraData.firstChatDate.toDateString()
                                    : "unknown"}
                            </div>
                            <div className="bar-extra-info">
                                Last interaction:{" "}
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
