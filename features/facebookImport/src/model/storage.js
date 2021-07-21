// TODO: Persist files in addFile/removeFile via polyIn
// TODO: Load files from disk during initialisation

export default class Storage {
    constructor() {
        this.changeListener = () => {};
        this._files = {};
    }

    get files() {
        return Object.values(this._files);
    }

    addFile(file) {
        // TODO: Detect / handle duplicate files better
        const id = file.time.getTime();
        this._files[id] = { ...file, id };
        this.changeListener();
    }

    removeFile({ id }) {
        delete this._files[id];
        this.changeListener();
    }
}
