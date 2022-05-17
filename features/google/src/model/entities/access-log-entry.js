import TimelineEvent from "./timeline-event";

export default class AccessLogEntry extends TimelineEvent {
    constructor({ timestamp, accessLog }) {
        super({ timestamp });

        this._accessLog = accessLog;
    }

    get activityType() {
        return this._accessLog;
    }
}
