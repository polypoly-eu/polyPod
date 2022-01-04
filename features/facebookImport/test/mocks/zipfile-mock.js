import { jsonStringifyWithUtfEscape } from "../../src/model/importers/utils/json-encoding";

//The minimum size of a .ZIP file is 22 bytes
export const MINIMUM_FILE_SIZE = 22;

export class ZipFileMock {
    constructor() {
        this.id = "polypod://de71f571-d90a-45e0-b007-d8f059e0541b";
        this.time = new Date("2021-09-20T16:37:36.243Z");
        this.name = "facebook-facebookuser.zip";
        this.size = MINIMUM_FILE_SIZE;
        this._entries = new Set();
    }

    async hasEntry(entry) {
        return this._entries.has(entry);
    }

    async getEntries() {
        return [...this._entries];
    }

    async hasFilePath(entryPath) {
        return [...this._entries].some((entry) => entryPath === entry.path);
    }

    async fileEntryForPath(entryPath) {
        return [...this._entries].find((entry) => entryPath === entry.path);
    }

    async getContent(entry) {
        return entry.content;
    }

    async stat(entry) {
        const entryContent = this._entries[entry];
        return {
            getId: () => entry,
            getTime: () => "",
            getName: () => entry.substr(this.id.length),
            getSize: () => entryContent.length,
            isFile: () => true,
            isDirectory: () => false,
        };
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
        const entry = {
            id: this.id + "/" + fileName,
            path: fileName,
            content: stringContent,
        };
        this._entries.add(entry);
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
