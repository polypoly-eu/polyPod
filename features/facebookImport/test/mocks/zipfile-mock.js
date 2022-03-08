import { jsonStringifyWithUtfEscape } from "../../src/model/importers/utils/json-encoding";

//The minimum size of a .ZIP file is 22 bytes
export const MINIMUM_FILE_SIZE = 22;
export class ZipFileEntryMock {
    constructor(zipFile, id, path, content) {
        this.zipFile = zipFile;
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
        const entryContent = this.zipFile.entries[this._id];
        return {
            getId: () => this._id,
            getTime: () => "",
            getName: () => this._id.substr(this.zipFile.id.length),
            getSize: () => entryContent.length,
            isFile: () => true,
            isDirectory: () => false,
        };
    }

    async getContent() {
        return this.content;
    }
}

export class ZipFileMock {
    constructor() {
        this.id = "polypod://de71f571-d90a-45e0-b007-d8f059e0541b";
        this.time = new Date("2021-09-20T16:37:36.243Z");
        this.name = "facebook-facebookuser.zip";
        this.size = MINIMUM_FILE_SIZE;
        this._entriesPathHash = new Map();
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
        const entry = new ZipFileEntryMock(
            this,
            entryId,
            fileName,
            stringContent
        );
        this._entriesPathHash.set(fileName, entry);
    }

    addEncodingEntry(fileName, escapedString) {
        const encoded = new TextEncoder("utf-8").encode(escapedString);
        this.addNamedEntry(fileName, encoded);
    }

    addTextEntry(fileName, stringContent) {
        const escapedString = unescape(encodeURIComponent(stringContent));
        this.addEncodingEntry(fileName, escapedString);
    }

    addJsonEntry(fileName, jsonData) {
        const escapedString = jsonStringifyWithUtfEscape(jsonData);
        this.addEncodingEntry(fileName, escapedString);
    }
}
