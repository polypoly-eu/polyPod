import {
    createErrorStatus,
    createSuccessStatus,
} from "../analyses/utils/analysis-status";
import { MissingFilesException } from "./utils/failed-import-exception";
import {
    readFullPathJSONFile,
    relevantZipEntries,
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
        return readFullPathJSONFile(targetFile.id, zipFile)
            .then((data) => {
                return { status: createSuccessStatus(), targetFile, data };
            })
            .catch((error) => {
                return { status: createErrorStatus(error) };
            });
    }

    async _importDataFromFiles(targetFiles, zipFile, facebookAccount) {
        const fileDataWithResults = await Promise.all(
            targetFiles.map((targetFile) =>
                this._readJSONFileWithStatus(targetFile, zipFile)
            )
        );

        const successfullResults = fileDataWithResults.filter(
            (result) => result.status.isSuccess
        );

        for (const each of successfullResults) {
            facebookAccount.addImportedFileName(each.targetFile.path);
        }
        const dataResults = successfullResults.map((result) => result.data);
        this._importRawDataResults(facebookAccount, dataResults);

        return fileDataWithResults
            .filter((result) => !result.status.isSuccess)
            .map(({ status }) => status);
    }

    _createMissingFilesError() {
        return new MissingFilesException();
    }

    async import({ zipFile, facebookAccount }) {
        const targetFiles = await this._extractTargetEntries(zipFile);
        if (targetFiles.length === 0) {
            throw this._createMissingFilesError();
        }

        const fileChunks = sliceIntoChunks(targetFiles, 5);
        const failedStatusChunks = [];
        for (let currentChunk of fileChunks) {
            const chunkStatuses = await this._importDataFromFiles(
                currentChunk,
                zipFile,
                facebookAccount
            );

            failedStatusChunks.push(chunkStatuses);
        }
        const failedStatuses = failedStatusChunks.flat();

        return failedStatuses.length > 0 ? failedStatuses : null;
    }
}
