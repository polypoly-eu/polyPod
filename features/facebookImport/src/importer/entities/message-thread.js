export default class MessageThread {
    constructor() {
        this._title = "";
        this._participants = [];
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
}
