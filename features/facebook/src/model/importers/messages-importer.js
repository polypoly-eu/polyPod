import MessageThreadsGroup from "../entities/message-threads-group.js";
import MultipleFilesImporter from "./multiple-files-importer.js";

export default class MessagesImporter extends MultipleFilesImporter {
    _isTargetPostFile(entryName) {
        return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
            entryName
        );
    }

    _processRawDataResults(dataResults) {
        const messageGroup = new MessageThreadsGroup();
        if (dataResults.length > 0)
            messageGroup.addMessageThreadsFromData(dataResults);
        return messageGroup;
    }
}

MessagesImporter.STORAGE_KEY = "messages";
