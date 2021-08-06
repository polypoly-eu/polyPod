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
                    name: file.name,
                    time: file.time,
                    size: (await polyOut.readFile(file.name)).length
                };
            }
            resolve(files);
        });
    }

    async readFile(path) {
        const { polyOut } = await this._pod;
        return polyOut.readFile(path);
    }

    async addFile(file) {
        return new Promise(async resolve => {
            // File is already added by importFile, just refresh
            await this.refreshFiles();
            this.changeListener();
        });
    }

    async removeFile(file) {
        return new Promise(async resolve => {
            const { polyOut } = await this._pod;
            await polyOut.removeFile(file);
            await this.refreshFiles();
            this.changeListener();
        });
    }
}
