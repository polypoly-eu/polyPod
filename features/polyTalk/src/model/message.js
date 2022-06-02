export class MessageClass {
    constructor({ message, date, sender }) {
        this.message = message;
        this.date = new Date(date) || new Date();
        this.sender = sender || "self";
        this.direction = this.sender === "self" ? "outgoing" : "incomming";
    }

    get timeElapsed() {
        return new Date() - this.date;
    }
}
