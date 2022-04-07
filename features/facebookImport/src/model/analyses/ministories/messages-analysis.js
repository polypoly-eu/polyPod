import React from "react";
import i18n from "../../../i18n";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

import {
    MessagesMiniStoryDetails,
    MessagesMiniStorySummary,
} from "../../../components/messagesMiniStory/messagesMiniStory.jsx";

export default class MessagesAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("explore:messages.title");
    }

    async analyze({ dataAccount }) {
        this._messagesCount = dataAccount.messagesCount;
        this._messagesThreadsData = [];
        const usernames = new Set();

        dataAccount.forEachMessageThread((messageThread) => {
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

    renderSummary() {
        return (
            <MessagesMiniStorySummary
                messagesCount={this._messagesCount}
                messagesThreadsData={this._messagesThreadsData}
                totalUsernamesCount={this._totalUsernamesCount}
            />
        );
    }

    renderDetails() {
        return (
            <MessagesMiniStoryDetails
                messagesCount={this._messagesCount}
                messagesThreadsData={this._messagesThreadsData}
                totalUsernamesCount={this._totalUsernamesCount}
            />
        );
    }
}
