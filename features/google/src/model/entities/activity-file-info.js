export default class ActivityFileInfo {
    constructor({ productName, fileSize }) {
        this._fileSize = fileSize;
        this._productName = productName;
    }

    get productName() {
        return this._productName;
    }

    get fileSize() {
        return this._fileSize;
    }
}
