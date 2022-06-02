export class MessageRoom {
    constructor(messages, participants) {
        this.messages = messages;
        this.participants = participants;
    }

    addMessage(message) {
        this.messages.push(message);
    }

    get lastMessage() {
        return this.messages[this.messages.length - 1];
    }
}
