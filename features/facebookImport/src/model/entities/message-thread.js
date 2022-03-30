import Entity from "./entity";

export default class MessageThread extends Entity {
    constructor() {
        super();
        this._title = "";
        this._participants = [];
        this._threadPath = "";
        this._messagesCount = 0;
        this._totalWordCount = 0;
        this._callsCount = 0;
        this._callsDuration = 0;
        this._messageTypes = [];
        this._messageTimestamps = [];
    }

    _initializeForMessageData(messageData) {
        if (messageData?.content) {
            const words = messageData.content.match(/\b(\w+)\b/g);
            this._totalWordCount += words ? words.length : 1;
        }
        this._messageTimestamps.push(messageData.timestamp_ms);
        if (!this._messageTypes.includes(messageData.type)) {
            this._messageTypes.push(messageData.type);
        }
        if (messageData?.type === "Call") {
            this._callsCount++;
            this._callsDuration += messageData.call_duration;
        }
    }

    initializeFromData(messageThreadData) {
        this._title = messageThreadData.title;
        this._participants = (messageThreadData.participants || []).map(
            (each) => each.name
        );
        this._threadPath = messageThreadData.thread_path;
        const messagesData = messageThreadData.messages;
        if (!messagesData) {
            return;
        }
        this._messagesCount = messagesData.length;
        messagesData.forEach((messageData) =>
            this._initializeForMessageData(messageData)
        );
    }

    get title() {
        return this._title;
    }

    get participants() {
        return this._participants;
    }

    get threadPath() {
        return this._threadPath;
    }

    get messagesCount() {
        return this._messagesCount;
    }

    get totalWordCount() {
        return this._totalWordCount;
    }

    get callsCount() {
        return this._callsCount;
    }

    get callsDuration() {
        return this._callsDuration;
    }

    get messageTypes() {
        return this._messageTypes;
    }

    get messageTimestamps() {
        return this._messageTimestamps;
    }

    forEachMessageTimestamp(callback) {
        for (const messageTimestamp of this._messageTimestamps) {
            callback(messageTimestamp);
        }
    }

    mergeThread(messageThread) {
        this._messagesCount += messageThread.messagesCount;
        this._totalWordCount += messageThread.totalWordCount;
        this._callsCount += messageThread.callsCount;
        this._callsDuration += messageThread.callsDuration;
        for (let type of messageThread.messageTypes) {
            if (this._messageTypes.includes(type)) continue;
            this._messageTypes.push(messageThread.type);
        }
        this._messageTimestamps.push(...messageThread.messageTimestamps);
    }
}
