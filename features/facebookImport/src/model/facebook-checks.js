export default class FacebookChecks {
    constructor(filesInZip) {
        this._entries = filesInZip;
        this._files = filesInZip.map((f) => f.name);
    }

    get files() {
        return Object.values(this._files);
    }

    isItHTMLExport() {
        const profileHTMLfile = this._files.filter(
            (f) => f === "profile_information/profile_information.html"
        );
        return profileHTMLfile.length >= 1;
    }
}
