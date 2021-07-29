export default class FacebookChecks {
    constructor(filesInZip) {
        this._files = filesInZip;
    }

    get files() {
        return Object.values(this._files);
    }
}
