import MultipleFilesImporter from "./multiple-files-importer.js";
import { MissingMessagesFilesException } from "./utils/failed-import-exception.js";
import { removeEntryPrefix } from "./utils/importer-util.js";

export default class MessagesImporter extends MultipleFilesImporter {
    _isTargetPostFile(entryName) {
        const formattedEntryName = removeEntryPrefix(entryName);
        return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
            formattedEntryName
        );
    }

    _importRawDataResults(facebookAccount, dataResults) {
        facebookAccount.messageThreadsGroup.addMessageThreadsFromData(
            dataResults
        );
    }

    _createMissingFilesError() {
        return new MissingMessagesFilesException();
    }
}
