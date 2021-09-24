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

    async addFile() {
        return new Promise((resolve) => {
            // File is already added by importFile, just refresh
            this.refreshFiles().then(() => {
                this.changeListener();
                resolve();
            });
        });
    }

    async removeFile(file) {
        return new Promise((resolve) => {
            const { polyNav } = this._pod;
            polyNav
                .removeFile(file)
                .then(() => {
                    this.refreshFiles().then(() => resolve());
                })
                .then(() => this.changeListener());
        });
    }
}

export class ZipFile {
    constructor(file, pod) {
        this._pod = pod;
        this._file = file;
    }

    async getEntries() {
        const { polyOut } = this._pod;
        return polyOut.readdir(this._file.id);
    }

    async data() {
        return this.getContent(this._file.id);
    }

    async getContent(entry) {
        const { polyOut } = this._pod;
        return polyOut.readFile(entry);
    }
}
