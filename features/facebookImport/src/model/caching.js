import EntityDeserializer from "./entities/utils/entity-serialisation";

const namespace = "http://polypoly.coop/schema/fbImport/";

export default class ExportDataCache {
    constructor(pod, fileId) {
        this._pod = pod;
        this._fileId = fileId;
    }

    _createAccessQuery(dataFactory) {
        return {
            subject: dataFactory.namedNode(`${this._fileId}/cache`),
            predicate: dataFactory.namedNode(`${namespace}importerCache`),
        };
    }

    async _selectDataQuad(dataFactory, polyIn) {
        return await polyIn.select(this._createAccessQuery(dataFactory));
    }

    _createDataQuad(dataFactory, rawData) {
        return dataFactory.quad(
            dataFactory.namedNode(`${this._fileId}/cache`),
            dataFactory.namedNode(`${namespace}importerCache`),
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
