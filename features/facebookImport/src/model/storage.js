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
        return new Promise((resolve) => {
            const { polyOut } = this._pod;
            this._files = [];
            polyOut.readdir("").then((files) => {
                for (const file of files) {
                    try {
                        this._files[file] = polyOut.stat(file);
                    } catch (e) {
                        console.log(e);
                    }
                }
                resolve(files);
            });
        });
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

    getEntries() {
        return new Promise((resolve) => {
            const { polyOut } = this._pod;
            polyOut.readdir(this._file.id).then((entries) => resolve(entries));
        });
    }

    data() {
        return new Promise((resolve) => {
            const { polyOut } = this._pod;
            polyOut.readFile(this._file.id).then((entries) => resolve(entries));
        });
    }

    getContent(entry) {
        return new Promise((resolve) => {
            const { polyOut } = this._pod;
            polyOut.readFile(entry).then((content) => resolve(content));
        });
    }
}
