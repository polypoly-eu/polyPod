import { Importer, Status, statusTypes } from "@polypoly-eu/poly-import";
import { MissingFilesException } from "./utils/failed-import-exception";
import {
    readFullPathJSONFile,
    relevantZipEntries,
} from "./utils/importer-util";

export default class MultipleFilesImporter extends Importer {
    // eslint-disable-next-line no-unused-vars
    _isTargetPostFile() {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    _processRawDataResults() {}

    async _extractTargetEntries(zipFile) {
        const entries = await relevantZipEntries(zipFile);
        return entries.filter((entry) => this._isTargetPostFile(entry.path));
    }

    async _readJSONFileWithStatus(targetEntry, zipFile) {
        return readFullPathJSONFile(targetEntry, zipFile)
            .then((data) => {
                return {
                    status: new Status({
                        name: statusTypes.success,
                    }),
                    targetEntry,
                    data,
                };
            })
            .catch((error) => {
                return {
                    status: new Status({
                        name: statusTypes.error,
                        message: error,
                    }),
                };
            });
    }

    _createMissingFilesError() {
        return new MissingFilesException();
    }

    async import({ zipFile }) {
        const targetEntries = await this._extractTargetEntries(zipFile);
        if (targetEntries.length === 0) {
            throw this._createMissingFilesError();
        }

        const responses = await Promise.all(
            targetEntries.map((entry) =>
                this._readJSONFileWithStatus(entry, zipFile)
            )
        );

        const successfulResponses = responses.filter(
            ({ status }) => status.isSuccess
        );

        const importedDataResults = this._processRawDataResults(
            successfulResponses.map(({ data }) => data)
        );

        const importedFileNames = responses
            .filter(({ status }) => status.isSuccess)
            .map(({ targetEntry }) => targetEntry.path);

        return {
            result: importedDataResults,
            report: {
                status:
                    responses.length !== successfulResponses.length &&
                    new Status({
                        name: statusTypes.error,
                        message: `${
                            successfulResponses.length + "/" + responses.length
                        } files imported successfully`,
                    }),
                statuses: responses.map(({ status }) => status),
                importedFileNames,
            },
        };
    }
}
