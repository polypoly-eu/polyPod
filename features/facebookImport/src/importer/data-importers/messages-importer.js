import { readJSONFile } from "./../../model/analysis-util.js";

function isJsonMessageFile(entryName, id) {
    const formattedEntryName = entryName.replace(`${id}/`, "");
    return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
        formattedEntryName
    );
}

export default class MessagesImporter {
    async import({ id, zipFile, facebookAccount }) {
        const entries = await zipFile.getEntries();
        const messageThreadFiles = entries.filter((fileName) =>
            isJsonMessageFile(fileName, id)
        );

        // TODO: The same message thread can be in multiple files
        const messageThreads = await Promise.all(
            messageThreadFiles.map((messageFile) =>
                readJSONFile(messageFile, zipFile)
            )
        );
        facebookAccount.messageThreads = messageThreads
            .filter((each) => each.status === "ok")
            .map((each) => each.data);
    }
}
