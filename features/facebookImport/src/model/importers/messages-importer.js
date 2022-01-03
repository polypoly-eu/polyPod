import MultipleFilesImporter from "./multiple-files-importer.js";

export default class MessagesImporter extends MultipleFilesImporter {
    _isTargetPostFile(entryName) {
        return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
            entryName.id
        );
    }

    _importRawDataResults(facebookAccount, dataResults) {
        facebookAccount.messageThreadsGroup.addMessageThreadsFromData(
            dataResults
        );
    }
}
