export class Room {
    constructor(name) {
        this.messages = [];
        this.name = name;
    }

    addMessage(message) {
        this.messages.push(message);
    }

    get lastMessage() {
        return this.messages[this.messages.length - 1];
    }
}
