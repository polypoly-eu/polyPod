import { IMPORT_ERROR, IMPORT_SUCCESS } from "../importer-status.js";
import { readJSONFile } from "../importer-util.js";

function isJsonMessageFile(entryName, id) {
    const formattedEntryName = entryName.replace(`${id}/`, "");
    return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
        formattedEntryName
    );
}

async function readJSONFileWithStatus(messageFile, zipFile) {
    return readJSONFile(messageFile, zipFile)
        .then((data) => {
            return { status: IMPORT_SUCCESS, messageFile, data };
        })
        .catch((error) => {
            return {
                status: IMPORT_ERROR,
                error,
            };
        });
}

export default class MessagesImporter {
    async import({ id, zipFile }, facebookAccount) {
        const entries = await zipFile.getEntries();
        const messageThreadFiles = entries.filter((fileName) =>
            isJsonMessageFile(fileName, id)
        );

        // TODO: The same message thread can be in multiple files
        const result = await Promise.all(
            messageThreadFiles.map((messageFile) =>
                readJSONFileWithStatus(messageFile, zipFile)
            )
        );
        const successfullResult = result.filter(
            (result) => result.status === IMPORT_SUCCESS
        );
        for (const each of successfullResult) {
            const fileNameParts = each.messageFile
                .replace(`${id}/`, "")
                .split("/");
            const fileName = fileNameParts.slice(1).join("/");
            facebookAccount.addImportedFileName(fileName);
        }
        facebookAccount.messageThreads = successfullResult.map(
            (result) => result.data
        );
    }
}
