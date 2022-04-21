import TimelineEvent from "./timeline-event";

export default class PlaceVisit extends TimelineEvent {
    constructor({ timestamp, locationName }) {
        super({ timestamp });

        this._locationName = locationName;
    }

    get locationName() {
        return this._locationName;
    }
}
