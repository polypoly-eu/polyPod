import { createErrorResult, IMPORT_SUCCESS } from "./utils/importer-status";
import {
    readFullPathJSONFile,
    relevantZipEntries,
    removeEntryPrefix,
    sliceIntoChunks,
} from "./utils/importer-util";

export default class MultipleFilesImporter {
    // eslint-disable-next-line no-unused-vars
    _isTargetPostFile(entryName) {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    _importRawDataResults(facebookAccount, dataResults) {}

    async _extractTargetEntries(zipFile) {
        const entries = await relevantZipEntries(zipFile);
        return entries.filter((fileName) => this._isTargetPostFile(fileName));
    }

    async _readJSONFileWithStatus(targetFile, zipFile) {
        return readFullPathJSONFile(targetFile, zipFile)
            .then((data) => {
                return { status: IMPORT_SUCCESS, targetFile, data };
            })
            .catch((error) => {
                return createErrorResult(this.constructor, error);
            });
    }

    async _importDataFromFiles(targetFiles, zipFile, facebookAccount) {
        const fileDataWithResults = await Promise.all(
            targetFiles.map((targetFile) =>
                this._readJSONFileWithStatus(targetFile, zipFile)
            )
        );

        const successfullResults = fileDataWithResults.filter(
            (result) => result.status === IMPORT_SUCCESS
        );

        for (const each of successfullResults) {
            const fileName = removeEntryPrefix(each.targetFile);
            facebookAccount.addImportedFileName(fileName);
        }
        const dataResults = successfullResults.map((result) => result.data);
        this._importRawDataResults(facebookAccount, dataResults);

        return fileDataWithResults.filter(
            (result) => !(result.status === IMPORT_SUCCESS)
        );
    }

    _createMissingFilesError() {
        return new Error("Missing import files");
    }

    async import({ zipFile, facebookAccount }) {
        const targetFiles = await this._extractTargetEntries(zipFile);
        if (targetFiles.length === 0) {
            throw this._createMissingFilesError();
        }

        const fileChunks = sliceIntoChunks(targetFiles, 5);
        const failedResultChunks = [];
        for (let currentChunk of fileChunks) {
            const resultChunk = await this._importDataFromFiles(
                currentChunk,
                zipFile,
                facebookAccount
            );

            failedResultChunks.push(resultChunk);
        }
        const failedResults = failedResultChunks.flat();

        return failedResults.length > 0 ? failedResults : null;
    }
}
