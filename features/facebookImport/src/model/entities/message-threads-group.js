import MessageThread from "./message-thread.js";

export default class MessageThreadsGroup {
    constructor() {
        this._messagesThreads = {};
    }

    get messagesThreads() {
        return Object.keys(this._messagesThreads).map(
            (key) => this._messagesThreads[key]
        );
    }

    get messageThreadsCount() {
        return Object.keys(this._messagesThreads).length;
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
        for (const messageThread of this._messagesThreads) {
            callback(messageThread);
        }
    }

    addMessageThreadFromData(messageThreadData) {
        const messageThread = new MessageThread();
        messageThread.initializeFromData(messageThreadData);
        const participant = messageThread.participants.toString();
        if (this._messagesThreads[participant]) {
            this.addToExistingThread(participant, messageThread);
        } else this._messagesThreads[participant] = messageThread;
    }

    addMessageThreadsFromData(messageThreadsData) {
        messageThreadsData.forEach((messageThreadData) =>
            this.addMessageThreadFromData(messageThreadData)
        );
    }

    addToExistingThread(participant, messageThread) {
        const existingThread = this._messagesThreads[participant];
        existingThread.mergeThread(messageThread);
    }
}
