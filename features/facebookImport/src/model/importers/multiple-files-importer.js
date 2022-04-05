import {
    createErrorStatus,
    createSuccessStatus,
} from "@polypoly-eu/poly-import";
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
        return entries.filter((entry) => this._isTargetPostFile(entry.path));
    }

    async _readJSONFileWithStatus(targetEntry, zipFile) {
        return readFullPathJSONFile(targetEntry, zipFile)
            .then((data) => {
                return { status: createSuccessStatus(), targetEntry, data };
            })
            .catch((error) => {
                return { status: createErrorStatus(error) };
            });
    }

    async _importDataFromFiles(targetEntries, zipFile, facebookAccount) {
        const fileDataWithResults = await Promise.all(
            targetEntries.map((targetEntry) =>
                this._readJSONFileWithStatus(targetEntry, zipFile)
            )
        );

        const successfullResults = fileDataWithResults.filter(
            (result) => result.status.isSuccess
        );

        for (const each of successfullResults) {
            facebookAccount.addImportedFileName(each.targetEntry.path);
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
        const targetEntries = await this._extractTargetEntries(zipFile);
        if (targetEntries.length === 0) {
            throw this._createMissingFilesError();
        }

        const entryChunks = sliceIntoChunks(targetEntries, 5);
        const failedStatusChunks = [];
        for (let currentChunk of entryChunks) {
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
