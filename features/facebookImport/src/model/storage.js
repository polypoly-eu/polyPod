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
        const { polyOut } = this._pod;
        this._files = [];
        const files = await polyOut.readdir("");
        for (let file of files) {
            this._files[file] = await polyOut.stat(file);
        }
        return files;
    }

    async readFile(path) {
        const { polyOut } = this._pod;
        return polyOut.readFile(path);
    }

    async addFile() {
        return new Promise((resolve) => {
            // File is already added by refreshFiles, just refresh
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
