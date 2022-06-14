import TimelineEvent from "./timeline-event";

export default class PlaceVisit extends TimelineEvent {
    constructor({ timestamp, locationName, duration }) {
        super({ timestamp });
        this._duration = duration;
        this._locationName = locationName;
    }

    get locationName() {
        return this._locationName;
    }

    get startDate() {
        return new Date(this.unixStartTimestamp);
    }

    get endDate() {
        return new Date(this.unixEndTimestamp);
    }

    get unixStartTimestamp() {
        return this._duration.startTimestampMs;
    }

    get unixEndTimestamp() {
        return this._duration.endTimestampMs;
    }

    get unixDuration() {
        return this._duration.endTimestampMs - this._duration.startTimestampMs;
    }
}
