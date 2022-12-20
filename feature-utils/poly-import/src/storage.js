/**
 * Convenience class for working with the file system.
 */
export class FeatureFileStorage {
    /**
     * Creates a new instance.
     * @param pod - The polyPod API object, e.g. `window.pod`.
     * @param [changeListener] - A listener called when a file gets removed.
     */
    constructor(pod, changeListener = () => {}) {
        this._changeListener = changeListener;
        this._files = null;
        this._pod = pod;
    }

    /**
     * All files available to the Feature. Can get out of sync with the file
     * system, call {@link FeatureFileStorage#refreshFiles} to update.
     */
    get files() {
        return !this._files ? this._files : Object.values(this._files);
    }

    /**
     * Synchronises the list of files with the file system.
     */
    async refreshFiles() {
        const { polyOut } = this._pod;
        const files = await polyOut.readDir("");
        const statResults = {};
        for (let file of files) {
            statResults[file.id] = await polyOut.stat(file.id);
        }
        this._files = statResults;
    }

    /**
     * Reads an individual file.
     * @param path - The path to the file to read.
     * @returns The contents of the file.
     */
    async readFile(path) {
        const { polyOut } = this._pod;
        return polyOut.readFile(path);
    }

    /**
     * Removes an archive file.
     * @param file - The ID of the archive file to remove.
     */
    async removeFile(file) {
        const { polyOut } = this._pod;
        await polyOut.removeArchive(file);
        await this.refreshFiles();
        this._changeListener();
    }
}

/**
 * Convenience class for working with files inside ZIP archives.
 */
export class ZipFileEntry {
    /**
     * Creates a new instance.
     * @param pod - The polyPod API object, e.g. `window.pod`.
     * @param zipFile {ZipFile} - The archive that contains this entry.
     * @param id - The ID of the entry.
     * @param path - The path of the entry.
     */
    constructor(pod, zipFile, id, path) {
        this._pod = pod;
        this._zipFile = zipFile;
        this._id = id;
        this._path = path;
    }

    /**
     * The ID of the entry.
     */
    get id() {
        return this._id;
    }

    /**
     * The path of the entry.
     */
    get path() {
        return this._path;
    }

    /**
     * Retrieves information about the entry.
     * @returns {object} An object with information about the file or directory
     * for this entry.
     */
    async stat() {
        const { polyOut } = this._pod;
        return polyOut.stat(this._id);
    }

    /**
     * Retrieves the contents of the entry.
     * @returns The contents of the file for this entry.
     */
    async getContent() {
        const { polyOut } = this._pod;
        return polyOut.readFile(this._id);
    }
}

/**
 * Convenience class for working with ZIP archives.
 */
export class ZipFile {
    /**
     * Creates a new instance.
     * @param file - The archive file to wrap.
     * @param pod - The polyPod API object, e.g. `window.pod`.
     */
    constructor(file, pod) {
        this._pod = pod;
        this._file = file;

        this._entriesPathHash = null;
    }

    /**
     * The ID of the wrapped archive file.
     */
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

    /**
     * Checks if the archive contains a path.
     * @param entryPath - The path to check for.
     * @returns `true` if the archive contains the path, otherwise `false`.
     */
    async hasEntryPath(entryPath) {
        await this._ensureCachedEntries();
        return this._entriesPathHash.has(entryPath);
    }

    /**
     * Retrieves an entry.
     * @param entryPath - The path to the entry to return.
     * @returns {ZipFileEntry|undefined} The entry if it exists, otherwise
     * `undefined`.
     */
    async findEntry(entryPath) {
        await this._ensureCachedEntries();
        return this._entriesPathHash.get(entryPath);
    }

    /**
     * Retrieves all entries.
     * @returns {ZipFileEntry[]}
     */
    async getEntries() {
        await this._ensureCachedEntries();
        return [...this._entriesPathHash.values()];
    }
}

/**
 * Creates a new instance with warmed cache.
 * @param file - The archive file to wrap.
 * @param pod - The polyPod API object, e.g. `window.pod`.
 * @returns {ZipFile}
 */
ZipFile.createWithCache = async function (file, pod) {
    let zipFile = new ZipFile(file, pod);
    await zipFile._ensureCachedEntries();
    return zipFile;
};
