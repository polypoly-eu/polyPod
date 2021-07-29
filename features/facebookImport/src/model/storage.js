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
        const { polyOut } = await this._pod;
        const fileList = await polyOut.readdir("fb/");
        this._files = [];
        for (const fileName of fileList) {
            this._files.push({
                id: fileName,
                data: await polyOut.readFile(`fb/${fileName}`),
                time: fileName,
            });
        }
    }

    async addFile(file) {
        // TODO: Detect / handle duplicate files better
        const id = file.time.getTime();
        const { polyOut } = await this._pod;
        const p0 = performance.now();
        await polyOut.writeFile(`fb/${id}`, file.data);
        const p1 = performance.now();
        console.log(`writeFile took: ${p1 - p0}`);
        const p2 = performance.now();
        await this.refreshFiles();
        console.log(`refreshFiles took: ${p2 - p1}`);
        this.changeListener();
    }

    async removeFile({ id }) {
        const { polyOut } = await this._pod;
        polyOut.deleteFile(`fb/${id}`);
        await this.refreshFiles();
        this.changeListener();
    }
}
