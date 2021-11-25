export default class Storage {
    constructor(pod) {
        this.changeListener = () => {};
        this._files = null;
        this._pod = pod;
    }

    get files() {
        return !this._files ? this._files : Object.values(this._files);
    }

    async refreshFiles() {
        const { polyOut } = this._pod;
        const files = await polyOut.readdir("");
        const statResults = {};
        for (let file of files) {
            statResults[file] = await polyOut.stat(file);
        }
        this._files = statResults;
        return files;
    }

    async readFile(path) {
        const { polyOut } = this._pod;
        return polyOut.readFile(path);
    }

    async removeFile(file) {
        const { polyOut } = this._pod;
        await polyOut.removeArchive(file);
        await this.refreshFiles();
        this.changeListener();
    }
}

export class ZipFile {
    constructor(file, pod) {
        this._pod = pod;
        this._file = file;

        this._entriesSet = null;
    }

    static async createFor(zipData, pod) {
        let zipFile = new this(zipData, pod);
        await zipFile._ensureCachedEntries();
        return zipFile;
    }

    get id() {
        return this._file.id;
    }

    async _readEntriesList() {
        const { polyOut } = this._pod;
        return polyOut.readdir(this.id);
    }

    async _ensureCachedEntries() {
        if (this._entriesSet !== null) return;
        const entriesList = await this._readEntriesList();
        this._entriesSet = new Set(entriesList);
    }

    async getEntries() {
        await this._ensureCachedEntries();
        return [...this._entriesSet];
    }

    async hasEntry(entryId) {
        await this._ensureCachedEntries();
        return this._entriesSet.has(entryId);
    }

    async data() {
        return this.getContent(this.id);
    }

    async stat(entry) {
        const { polyOut } = this._pod;
        return polyOut.stat(entry);
    }

    async getContent(entry) {
        const { polyOut } = this._pod;
        return polyOut.readFile(entry);
    }
}
