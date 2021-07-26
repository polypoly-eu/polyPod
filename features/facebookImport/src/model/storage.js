// TODO: Load files from disk during initialisation
import {base64EncArr, base64DecToArr} from "./base64utils"

const namespace = "http://polypoly.coop/schema/facebook-import/";

export default class Storage {
    constructor(pod) {
        this.changeListener = () => {};
        this._files = {};
        this._pod = pod;
    }

    get files() {
        return Object.values(this._files);
    }

    async _refreshFiles() {
        const { dataFactory, polyIn } = await this._pod;
        const quad = dataFactory.quad(
            dataFactory.namedNode(`${namespace}zipFiles`),
            null, null
        );

        (await polyIn.select(quad)).forEach(fileQuad => {
            debugger;
            console.log(fileQuad);
            console.log(fileQuad.predicate);
            const id = fileQuad.predicate.slice(
                `${namespace}file/`.length
            );
            const file = {
                id,
                data: base64DecToArr(data)
            };
            this._files[id] = file;
        });
    }

    async addFile(file) {
        // TODO: Detect / handle duplicate files better
        const id = file.time.getTime();
        const { dataFactory, polyIn } = await this._pod;
        const quad = dataFactory.quad(
            dataFactory.namedNode(`${namespace}zipFiles`),
            dataFactory.namedNode(`${namespace}file/${id}`),
            dataFactory.namedNode(base64EncArr(file.data))
        );

        await polyIn.add(quad);
        await this._refreshFiles()
        this.changeListener();
    }

    async removeFile({ id }) {
        delete this._files[id];
        const { dataFactory, polyIn } = await this._pod;
        const quad = dataFactory.quad(
            dataFactory.namedNode(`${namespace}zipFiles`),
            dataFactory.namedNode(`${namespace}file/${id}`),
            null
        );
        await polyIn.delete(quad);
        await this._refreshFiles()
        this.changeListener();
    }
}
