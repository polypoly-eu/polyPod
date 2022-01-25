export default class ConnectedAdvertiser {
    constructor() {
        this._name = null;
        this._hasDataFileCustomAudience = false;
        this._hasRemarketingCustomAudience = false;
        this._hasInPersonStoreVisit = false;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get hasDataFileCustomAudience() {
        return this._hasDataFileCustomAudience;
    }

    set hasDataFileCustomAudience(booleanValue) {
        this._hasDataFileCustomAudience = booleanValue;
    }

    get hasRemarketingCustomAudience() {
        return this._hasRemarketingCustomAudience;
    }

    set hasRemarketingCustomAudience(booleanValue) {
        this._hasRemarketingCustomAudience = booleanValue;
    }

    get hasInPersonStoreVisit() {
        return this._hasInPersonStoreVisit;
    }

    set hasInPersonStoreVisit(booleanValue) {
        this._hasInPersonStoreVisit = booleanValue;
    }
}
