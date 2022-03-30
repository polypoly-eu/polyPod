import EntitiesGroup from "./entities-group.js";
import MessageThread from "./message-thread.js";

export default class MessageThreadsGroup extends EntitiesGroup {
    constructor() {
        super();
        this._messagesThreads = {};
    }

    get messagesThreads() {
        return Object.values(this._messagesThreads);
    }

    get messageThreadsCount() {
        return this.messagesThreads.length;
    }

    get messagesCount() {
        return this.messagesThreads.reduce(
            (total, messageThread) => total + messageThread.messagesCount,
            0
        );
    }

    get hasMessages() {
        return this.messagesCount > 0;
    }

    forEachMessageThread(callback) {
        for (const messageThread of this.messagesThreads) {
            callback(messageThread);
        }
    }

    addMessageThreadFromData(messageThreadData) {
        const messageThread = new MessageThread();
        messageThread.initializeFromData(messageThreadData);
        const threadPath = messageThread.threadPath;
        if (this._messagesThreads[threadPath]) {
            this.addToExistingThread(threadPath, messageThread);
        } else this._messagesThreads[threadPath] = messageThread;
    }

    addMessageThreadsFromData(messageThreadsData) {
        messageThreadsData.forEach((messageThreadData) =>
            this.addMessageThreadFromData(messageThreadData)
        );
    }

    addToExistingThread(threadPath, messageThread) {
        const existingThread = this._messagesThreads[threadPath];
        existingThread.mergeThread(messageThread);
    }
}
