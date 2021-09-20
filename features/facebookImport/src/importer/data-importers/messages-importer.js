import { createErrorResult, IMPORT_SUCCESS } from "../importer-status.js";
import { readJSONFile } from "../importer-util.js";

export default class MessagesImporter {
    _isJsonMessageFile(entryName, id) {
        const formattedEntryName = entryName.replace(`${id}/`, "");
        return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
            formattedEntryName
        );
    }

    async _extractJsonEntries(id, zipFile) {
        const entries = await zipFile.getEntries();
        return entries.filter((fileName) =>
            this._isJsonMessageFile(fileName, id)
        );
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

    _importMessageThread(id, facebookAccount, messageThreadResults) {
        const successfullResults = messageThreadResults.filter(
            (result) => result.status === IMPORT_SUCCESS
        );

        for (const each of successfullResults) {
            const fileNameParts = each.messageFile
                .replace(`${id}/`, "")
                .split("/");
            const fileName = fileNameParts.join("/");
            facebookAccount.addImportedFileName(fileName);
        }
        facebookAccount.messageThreads = successfullResults.map(
            (result) => result.data
        );
    }

    async import({ id, zipFile }, facebookAccount) {
        const messageThreadFiles = await this._extractJsonEntries(id, zipFile);

        // TODO: The same message thread can be in multiple files
        const messageThreadResults = await Promise.all(
            messageThreadFiles.map((messageFile) =>
                this._readJSONFileWithStatus(messageFile, zipFile)
            )
        );
        this._importMessageThread(id, facebookAccount, messageThreadResults);

        const failedResults = messageThreadResults.filter(
            (result) => !(result.status === IMPORT_SUCCESS)
        );
        return failedResults.length > 0 ? failedResults : null;
    }
}
