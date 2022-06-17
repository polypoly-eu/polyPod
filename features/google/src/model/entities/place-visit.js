import TimelineEvent from "./timeline-event";

export default class PlaceVisit extends TimelineEvent {
    constructor({ timestamp, locationName, endTimestamp }) {
        super({ timestamp });
        this._endTimestamp = endTimestamp;
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
        return this.timestamp.getTime() || this.timestamp;
    }

    get unixEndTimestamp() {
        return this._endTimestamp.getTime() || this._timestamp;
    }

    get unixDuration() {
        return this.unixEndTimestamp - this.unixStartTimestamp;
    }
}
