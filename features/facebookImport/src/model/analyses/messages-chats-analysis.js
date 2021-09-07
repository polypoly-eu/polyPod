import React from "react";
import BarChart from "../../components/dataViz/barChart.jsx";
import RootAnalysis from "./root-analysis";

export default class MessagesChatsAnalysis extends RootAnalysis {
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
            var wordCount = 0;
            var firstChatTimestamp = 0;
            var lastChatTimestamp = 0;
            messageThread.messages.forEach((message) => {
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
            this._messagesThreadsData = this._messagesThreadsData.slice(0, 10);
        });
    }

    render() {
        if (!this.active) {
            return "No Data!";
        }
        return (
            <>
                <p>
                    Your Facebook data also contains all your chats from
                    messenger: {this._messagesCount} messages. Here is the list
                    of your top 10 chats by the number of messages.
                </p>
                <BarChart
                    data={this._messagesThreadsData}
                    footerContent={({ count, extraData }) => (
                        <div>
                            <div className="bar-extra-info">
                                {count} messages having {extraData.wordCount}{" "}
                                words
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
                        </div>
                    )}
                />
            </>
        );
    }
}
