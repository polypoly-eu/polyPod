export class FeatureFileStorage {
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
        const files = await polyOut.readDir("");
        const statResults = {};
        for (let file of files) {
            statResults[file.id] = await polyOut.stat(file.id);
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

export class ZipFileEntry {
    constructor(pod, zipFile, id, path) {
        this._pod = pod;
        this._zipFile = zipFile;
        this._id = id;
        this._path = path;
    }

    get id() {
        return this._id;
    }

    get path() {
        return this._path;
    }

    async stat() {
        const { polyOut } = this._pod;
        return polyOut.stat(this._id);
    }

    async getContent() {
        const { polyOut } = this._pod;
        return polyOut.readFile(this._id);
    }
}

export class ZipFile {
    constructor(file, pod) {
        this._pod = pod;
        this._file = file;

        this._entriesPathHash = null;
    }

    get id() {
        return this._file.id;
    }

    async _readEntriesList() {
        const { polyOut } = this._pod;
        return polyOut.readDir(this.id);
    }

    async _ensureCachedEntries() {
        if (this._entriesPathHash !== null) return;
        const entriesList = await this._readEntriesList();
        this._entriesPathHash = new Map();
        entriesList.forEach((entry) =>
            this._entriesPathHash.set(
                entry.path,
                new ZipFileEntry(this._pod, this, entry.id, entry.path)
            )
        );
    }

    async hasEntryPath(entryPath) {
        await this._ensureCachedEntries();
        return this._entriesPathHash.has(entryPath);
    }

    async findEntry(entryPath) {
        await this._ensureCachedEntries();
        return this._entriesPathHash.get(entryPath);
    }

    async getEntries() {
        await this._ensureCachedEntries();
        return [...this._entriesPathHash.values()];
    }
}

ZipFile.createWithCache = async function (zipData, pod) {
    let zipFile = new ZipFile(zipData, pod);
    await zipFile._ensureCachedEntries();
    return zipFile;
};
