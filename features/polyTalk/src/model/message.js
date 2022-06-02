export class Message {
    constructor({ message, date, sender }) {
        this.message = message;
        this.date = new Date(date) || new Date();
        this.sender = sender;
        this.direction = sender ? "incomming" : "outgoing";
    }

    timeElapsed() {
        return new Date() - this.date;
    }
}
