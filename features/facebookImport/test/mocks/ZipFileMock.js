export class ZipFileMock {
    constructor() {
        this.id = "polypod://de71f571-d90a-45e0-b007-d8f059e0541b";
        this.time = new Date("2021-09-20T16:37:36.243Z");
        this.name = "facebook-facebookuser.zip";
        this.size = 22; //The minimum size of a .ZIP file is 22 bytes
        this._entries = {};
    }

    async getEntries() {
        return Object.keys(this._entriesMap);
    }

    async getContent(entry) {
        return this._entriesMap[entry];
    }

    enrichedData() {
        return {
            id: this.id,
            time: this.time,
            name: this.name,
            size: this.size,
        };
    }
}
