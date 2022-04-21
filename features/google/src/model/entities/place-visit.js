export default class PlaceVisit {
    constructor({ timestamp, locationName }) {
        this._timestamp = timestamp;
        this._locationName = locationName;
    }

    get timestamp() {
        return this._timestamp;
    }

    get locationName() {
        return this._locationName;
    }
}
