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
        return new Promise(async resolve => {
            const { polyOut } = await this._pod;
            this._files = [];
            const files = await polyOut.readdir("");
            for (const file of files) {
                this._files[file.name] = {
                    id: file.name,
                    time: file.time,
                    data: await polyOut.readFile(file.name)
                };
            };
            resolve(files);
        });
    }

    async addFile(file) {
        // TODO: Detect / handle duplicate files better
        await this.refreshFiles();
        this.changeListener();
    }

    async removeFile({ id }) {
        await this.refreshFiles();
        const { polyOut } = await this._pod;
        this.changeListener();
    }
}
