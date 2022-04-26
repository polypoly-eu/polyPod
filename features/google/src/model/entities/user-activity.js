import TimelineEvent from "./timeline-event";

export default class UserActivity extends TimelineEvent {
    constructor({ timestamp, productName }) {
        super({ timestamp });

        this._productName = productName;
    }

    get productName() {
        return this._productName;
    }
}
