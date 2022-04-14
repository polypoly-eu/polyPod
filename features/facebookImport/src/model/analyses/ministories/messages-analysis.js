import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../../analysisKeys";

export default class MessagesAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    async analyze({ dataAccount }) {
        let messagesCount = dataAccount.messagesCount;
        let messagesThreadsData = [];
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

            messagesThreadsData.push({
                title: messageThread.title,
                count: messageThread.messagesCount,
                extraData: {
                    firstChatDate,
                    lastChatDate,
                },
            });
        });

        messagesThreadsData.sort((a, b) => b.count - a.count);

        if (messagesThreadsData.length > 0) {
            account.analyses[analysisKeys.messagesThreadsData] =
                messagesThreadsData;
            account.analyses[analysisKeys.messagesCount] = messagesCount;
            account.analyses[analysisKeys.totalUsernamesCount] = usernames.size;
        }
    }
}
