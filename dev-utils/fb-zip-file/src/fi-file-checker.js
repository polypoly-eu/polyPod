/**
 * Checks the file structure, described as a hash that uses routes as
 * keys and file names as leaves.
 *
 * @class
 */
export class FiFileChecker {
    /**
     * Class constructor
     *
     * @param fileStructure - array with the filesystem routes to check against
     */
    constructor(fileStructure) {
        this._fileStructure = fileStructure;
    }


    /**
     * Check structure of an imported zip file
     *
     * @param structure - array with the filesystem routes to check against
     */
    checkStructure(structure) {
        const intersection = structure.filter((value) =>
            this._fileStructure.includes(value)
        );
        return intersection.length === this._fileStructure.length;
    }
}
