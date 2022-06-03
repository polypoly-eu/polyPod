import TimelineEvent from "./timeline-event";

export default class ActivitySegment extends TimelineEvent {
    constructor({ timestamp, activityType }) {
        super({ timestamp });

        this._activityType = activityType;
    }

    get activityType() {
        return this._activityType;
    }
}
