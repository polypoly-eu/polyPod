import MessageThread from "./message-thread.js";

export default class MessageThreadsGroup {
    constructor() {
        this._messagesThreads = [];
    }

    get messagesThreads() {
        return this._messagesThreads;
    }

    get messageThreadsCount() {
        return this._messagesThreads.length;
    }

    get messagesCount() {
        return this._messagesThreads.reduce(
            (total, messageThread) => total + messageThread.messagesCount,
            0
        );
    }

    get hasMessages() {
        return this.messagesCount > 0;
    }

    forEachMessageThread(callback) {
        for (const messageThread of this._messagesThreads) {
            callback(messageThread);
        }
    }

    addMessageThreadFromData(messageThreadData) {
        const messageThread = new MessageThread();
        messageThread.initializeFromData(messageThreadData);
        this._messagesThreads.push(messageThread);
    }

    addMessageThreadsFromData(messageThreadsData) {
        messageThreadsData.forEach((messageThreadData) =>
            this.addMessageThreadFromData(messageThreadData)
        );
    }
}
