import { jsonStringifyWithUtfEscape } from "./json-encoding";

/**
 * The minimum size of a ZIP archive.
 */
export const MINIMUM_FILE_SIZE = 22;

/**
 * Mock of {@link ZipFileEntry} for testing.
 */
export class ZipFileEntryMock {
    constructor(id, path, content) {
        this._id = id;
        this._path = path;
        this.content = content;
    }

    get path() {
        return this._path;
    }
    get id() {
        return this._id;
    }

    async stat() {
        return {
            getId: () => this._id,
            getTime: () => "",
            getName: () => this._path,
            getSize: () => this.content.length,
            isFile: () => true,
            isDirectory: () => false,
        };
    }

    async getContent() {
        return this.content;
    }
}

/**
 * Mock of {@link ZipFile} for testing.
 */
export class ZipFileMock {
    constructor(
        dataFilePairs = [["foo.json", { foo: "bar" }]],
        name = "facebook-facebookuser.zip"
    ) {
        this.id = "polypod://de71f571-d90a-45e0-b007-d8f059e0541b";
        this.time = new Date("2021-09-20T16:37:36.243Z");
        this.name = name;
        this.size = MINIMUM_FILE_SIZE;
        this._entriesPathHash = new Map();
        dataFilePairs.forEach(([path, dataset]) =>
            this.addJsonEntry(path, dataset)
        );
    }

    async getEntries() {
        return [...this._entriesPathHash.values()];
    }

    async hasEntryPath(entryPath) {
        return this._entriesPathHash.has(entryPath);
    }

    async findEntry(entryPath) {
        return this._entriesPathHash.get(entryPath);
    }

    enrichedData() {
        return { ...this.enrichedFileData(), zipFile: this };
    }

    enrichedFileData() {
        return {
            id: this.id,
            time: this.time,
            name: this.name,
            size: this.size,
        };
    }

    addNamedEntry(fileName, stringContent) {
        const entryId = this.id + "/" + fileName;
        const entry = new ZipFileEntryMock(entryId, fileName, stringContent);
        this._entriesPathHash.set(fileName, entry);
    }

    addEncodingEntry(fileName, escapedString) {
        const encoded = new TextEncoder("utf-8").encode(escapedString);
        this.addNamedEntry(fileName, encoded);
    }

    addTextEntry(fileName, stringContent) {
        const escapedString = decodeURI(encodeURIComponent(stringContent));
        this.addEncodingEntry(fileName, escapedString);
    }

    addJsonEntry(fileName, jsonData) {
        const escapedString = jsonStringifyWithUtfEscape(jsonData);
        this.addEncodingEntry(fileName, escapedString);
    }
}
