import { MissingMessagesFilesException } from "../failed-import-exception.js";
import { createErrorResult, IMPORT_SUCCESS } from "../importer-status.js";
import {
    readJSONFile,
    relevantZipEntries,
    removeEntryPrefix,
} from "../importer-util.js";

export default class MessagesImporter {
    _isJsonMessageFile(entryName) {
        const formattedEntryName = removeEntryPrefix(entryName);
        return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
            formattedEntryName
        );
    }

    async _extractJsonEntries(zipFile) {
        const entries = await relevantZipEntries(zipFile);
        return entries.filter((fileName) => this._isJsonMessageFile(fileName));
    }

    async _readJSONFileWithStatus(messageFile, zipFile) {
        return readJSONFile(messageFile, zipFile)
            .then((data) => {
                return { status: IMPORT_SUCCESS, messageFile, data };
            })
            .catch((error) => {
                return createErrorResult(MessagesImporter, error);
            });
    }

    _importMessageThread(facebookAccount, messageThreadResults) {
        const successfullResults = messageThreadResults.filter(
            (result) => result.status === IMPORT_SUCCESS
        );

        for (const each of successfullResults) {
            const fileName = removeEntryPrefix(each.messageFile);
            facebookAccount.addImportedFileName(fileName);
        }
        facebookAccount.messageThreads = successfullResults.map(
            (result) => result.data
        );
    }

    async import({ zipFile }, facebookAccount) {
        const messageThreadFiles = await this._extractJsonEntries(zipFile);
        if (messageThreadFiles.length === 0) {
            throw new MissingMessagesFilesException();
        }

        // TODO: The same message thread can be in multiple files
        const messageThreadResults = await Promise.all(
            messageThreadFiles.map((messageFile) =>
                this._readJSONFileWithStatus(messageFile, zipFile)
            )
        );
        this._importMessageThread(facebookAccount, messageThreadResults);

        const failedResults = messageThreadResults.filter(
            (result) => !(result.status === IMPORT_SUCCESS)
        );
        return failedResults.length > 0 ? failedResults : null;
    }
}
