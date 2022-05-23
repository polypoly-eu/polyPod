import TimelineEvent from "./timeline-event";

export default class AccessLogEntry extends TimelineEvent {
    constructor({ timestamp, productName }) {
        super({ timestamp });

        this.productName = productName;
    }
}
