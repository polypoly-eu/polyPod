export class FiFileChecker {
    constructor(fileStructure) {
        this._fileStructure = fileStructure;
    }

    checkStructure(structure) {
        const intersection = structure.filter((value) =>
            this._fileStructure.includes(value)
        );
        return intersection.length === this._fileStructure.length;
    }
}
