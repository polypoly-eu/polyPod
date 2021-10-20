import React, { useRef } from "react";
import i18n from "../../../i18n";
import RootAnalysis from "./root-analysis";
import InfoButton from "../../../components/buttons/infoButton/infoButton.jsx";

import BarChart from "../../../components/dataViz/barChart.jsx";

export default class MessagesAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

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
            var wordCount = messageThread.totalWordCount;
            var firstChatTimestamp = 0;
            var lastChatTimestamp = 0;

            for (let participant of messageThread.participants) {
                usernames.add(participant);
            }
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

            this._totalUsernamesCount = usernames.size;
        });
    }

    _calculateFontSize(text, maxWidth) {
        const minFontSize = 10;
        const maxFontSize = 80;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        for (let fontSize = maxFontSize; fontSize > minFontSize; fontSize--) {
            context.font = `${fontSize}px Jost`;
            if (context.measureText(text).width <= maxWidth) return fontSize;
        }
        return minFontSize;
    }

    renderSummary() {
        const refWidth = useRef(0);

        const fontSize = this._calculateFontSize(
            this._messagesCount,
            refWidth.current.clientWidth
        );

        return (
            <>
                <h2
                    className="messages-count"
                    style={{ fontSize: fontSize }}
                    ref={refWidth}
                >
                    {this._messagesCount}
                </h2>
                <p>
                    {i18n.t("explore:messages.summary", {
                        messages: this._messagesCount,
                        threads: this._messagesThreadsData.length,
                        people: this._totalUsernamesCount,
                    })}
                </p>
            </>
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
                <InfoButton route="/report/details/messages-info" />
                <p className="source">
                    {i18n.t("common:source.your.facebook.data")}
                </p>
            </>
        );
    }
}
