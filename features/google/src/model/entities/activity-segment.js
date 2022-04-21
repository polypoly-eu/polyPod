export default class ActivitySegment {
    constructor({ timestamp, activityType }) {
        this._timestamp = timestamp;
        this._activityType = activityType;
    }

    get timestamp() {
        return this._timestamp;
    }

    get activityType() {
        return this._activityType;
    }
}
