import EntityDeserializer from "./entities/utils/entity-serialisation";

const namespace = "http://polypoly.coop/schema/fbImport/";

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

    async removeFile(fileID) {
        const { polyOut } = this._pod;
        await polyOut.removeArchive(fileID);
        await this.refreshFiles();
        this.changeListener();
    }
}

export class ExportDataCache {
    constructor(pod, fileId) {
        this._pod = pod;
        this._fileId = fileId;
    }

    _createAccessQuery(dataFactory) {
        return {
            subject: dataFactory.namedNode(
                `${namespace}facebookImporter/importerCache`
            ),
            predicate: dataFactory.namedNode(
                `${namespace}facebookImporter/cachedData`
            ),
        };
    }

    async _selectDataQuad(dataFactory, polyIn) {
        return await polyIn.select(this._createAccessQuery(dataFactory));
    }

    _createDataQuad(dataFactory, rawData) {
        return dataFactory.quad(
            dataFactory.namedNode(`${namespace}facebookImporter/importerCache`),
            dataFactory.namedNode(`${namespace}facebookImporter/cachedData`),
            dataFactory.literal(rawData)
        );
    }

    async _readDataQuad(dataFactory, polyIn) {
        const dataQuads = await this._selectDataQuad(dataFactory, polyIn);
        if (dataQuads.length === 0) return undefined;
        return dataQuads[0];
    }

    async readData() {
        const { dataFactory, polyIn } = this._pod;
        const dataQuad = await this._readDataQuad(dataFactory, polyIn);
        if (!dataQuad) return undefined;
        const rawData = dataQuad.object?.value;
        return rawData;
    }

    async clearData() {
        const { dataFactory, polyIn } = this._pod;
        const dataQuad = await this._readDataQuad(dataFactory, polyIn);
        if (!dataQuad) return undefined;
        polyIn.delete(dataQuad);
    }

    async writeData(data) {
        const { dataFactory, polyIn } = this._pod;
        const jsonString = JSON.stringify(data);
        polyIn.add(this._createDataQuad(dataFactory, jsonString));
    }

    async loadData() {
        const cacheData = await this.readData();
        if (!cacheData) return undefined;

        let loadedData = null;
        try {
            loadedData = EntityDeserializer.parse(cacheData);
        } catch {
            // We capture all exceptions that can happen when loading the cache.
            // Also if we cannot load the cache we remove it.
            this.clearData();
            return null;
        }

        // In case the cache is invalid for the current version we clear the cache.
        const info = await this._pod.info;
        if (loadedData.basePolyPodVersion !== (await info.getVersion())) {
            this.clearData();
            return undefined;
        }

        return loadedData;
    }
}

export class ZipFile {
    constructor(file, pod) {
        this._pod = pod;
        this._file = file;
    }

    get id() {
        return this._file.id;
    }

    async getEntries() {
        const { polyOut } = this._pod;
        return polyOut.readdir(this.id);
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
