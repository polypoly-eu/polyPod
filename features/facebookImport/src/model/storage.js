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
                try {
                    this._files[file] = await polyOut.stat(file);
                }
                catch (e) {
                    console.log(e);
                }
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
            const { polyNav } = await this._pod;
            await polyNav.removeFile(file);
            await this.refreshFiles();
            this.changeListener();
        });
    }
}

export class ZipFile {
    constructor(file, pod) {
        this._pod = pod;
        this._file = file;
    }

    getEntries() {
        return new Promise(async resolve => {
            const { polyOut } = await this._pod;
            const entries = await polyOut.readdir(this._file.id);
            resolve(entries);
        });
    }

    data() {
        return new Promise(async resolve => {
            const { polyOut } = await this._pod;
            const entries = await polyOut.readFile(this._file.id);
            resolve(entries);
        });
    }

    getContent(entry) {
        return new Promise(async resolve => {
            const { polyOut } = await this._pod;
            const content = await polyOut.readFile(entry);
            resolve(content);
        });
    }

}
