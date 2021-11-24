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

        this._entriesList = null;
        this._entriesSet = null;
    }

    get id() {
        return this._file.id;
    }

    async _readEntriesList() {
        const { polyOut } = this._pod;
        return await polyOut.readdir(this.id);
    }

    async refreshCachedEntries() {
        this._entriesList = await this._readEntriesList();
        this._entriesSet = new Set(this._entriesList);
    }

    async getEntries() {
        if (this._entriesList !== null) return this._entriesList;
        return await this._readEntriesList();
    }

    async hasEntry(entryId) {
        if (this._entriesSet !== null) return this._entriesSet.has(entryId);
        return await this._readEntriesList().includes(entryId);
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
