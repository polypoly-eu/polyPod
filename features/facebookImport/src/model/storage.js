import { base64DecToArr, base64EncArr } from "./base64utils";
const namespace = "http://polypoly.coop/schema/fbImport/";
export default class Storage {
    constructor(pod) {
        this.changeListener = () => {};
        this._files = {};
        this._pod = pod;
    }

    get files() {
        return Object.values(this._files);
    }

    async refreshFiles() {
        const { dataFactory, polyIn } = await this._pod;
        const quad = dataFactory.quad(
            dataFactory.namedNode(`${namespace}zipFiles`),
            null,
            null
        );
        this._files = [];
        (await polyIn.select(quad)).forEach((fileQuad) => {
            const id = fileQuad.predicate.value.slice(
                `${namespace}file/`.length
            );
            const file = {
                id,
                data: base64DecToArr(fileQuad.object.value), // guessing here
            };
            this._files[id] = file; // This seems to be re-adding the file even if deleted
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
        await this.refreshFiles();
        this.changeListener();
    }

    async removeFile({ id }) {
        const { dataFactory, polyIn } = await this._pod;
        const quad = dataFactory.quad(
            dataFactory.namedNode(`${namespace}zipFiles`),
            dataFactory.namedNode(`${namespace}file/${id}`),
            null
        );
        (await polyIn.select(quad)).forEach((fileQuad) => {
            polyIn.delete(fileQuad);
        });
        await this.refreshFiles();
        this.changeListener();
    }
}
