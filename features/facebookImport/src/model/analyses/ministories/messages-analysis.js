import React, { useRef } from "react";
import i18n from "../../../i18n";
import RootAnalysis from "./root-analysis";
import MessagesMiniStory from "../../../components/messagesMiniStory/messagesMiniStory.jsx";

import "./ministories.css";

export default class MessagesAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("explore:messages.title");
    }

    async analyze({ facebookAccount }) {
        this._messagesCount = facebookAccount.messagesCount;
        this._messagesThreadsData = [];
        const usernames = new Set();

        facebookAccount.forEachMessageThread((messageThread) => {
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
                    firstChatDate,
                    lastChatDate,
                },
            });
        });

        this._messagesThreadsData.sort((a, b) => b.count - a.count);
        this._totalUsernamesCount = usernames.size;

        this.active = this._messagesThreadsData.length > 0;
    }

    _calculateFontSize(text, maxWidth) {
        // TODO: Extract text size affecting styles from target element
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
            <div className="render-summary">
                <h2
                    style={{
                        fontSize: fontSize,
                        marginBottom: "35px",
                        marginTop: "25px",
                    }}
                    ref={refWidth}
                >
                    {this._messagesCount.toLocaleString("de-DE")}
                </h2>
                <p>
                    {i18n.t("explore:messages.summary", {
                        messages: this._messagesCount,
                        threads: this._messagesThreadsData.length,
                        people: this._totalUsernamesCount,
                    })}
                </p>
            </div>
        );
    }

    renderDetails() {
        return (
            <MessagesMiniStory
                totalUserNames={this._totalUsernamesCount}
                messagesThreads={this._messagesThreadsData}
            />
        );
    }
}
