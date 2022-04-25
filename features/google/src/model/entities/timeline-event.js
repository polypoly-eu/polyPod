export default class TimelineEvent {
    constructor({ timestamp }) {
        this._timestamp = timestamp;
    }

    get timestamp() {
        return this._timestamp;
    }
}
