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
<<<<<<< HEAD
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
=======
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
>>>>>>> main
    }
}
