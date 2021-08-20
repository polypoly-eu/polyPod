import { readJSONFile } from "./../analysis-util.js";

function isJsonMessageFile(entryName, id) {
    const formattedEntryName = entryName.replace(`${id}/`, "");
    return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
        formattedEntryName
    );
}

class MessagesAnalysis {
    get title() {
        return "Messages";
    }

    get id() {
        return "messsages";
    }

    get dataEntitiesCount() {
        return this._messagesCount;
    }

    async _messagesCountFromFile(zipFile, messagesFile) {
        const messagesData = await readJSONFile(messagesFile, zipFile);

        if (!(messagesData.status === "ok")) {
            return 0;
        }

        const messagesList = messagesData.data?.messages;
        return messagesList ? messagesList.length : 0;
    }

    async parse({ id, zipFile }) {
        this._messageThreadsCount = 0;
        this._messagesCount = 0;
        this.active = false;
        if (!zipFile) return;

        const entries = await zipFile.getEntries();
        const messagesFiles = entries.filter((fileName) =>
            isJsonMessageFile(fileName, id)
        );
        this._messageThreadsCount = messagesFiles.length;
        const filesMessagesCount = await Promise.all(
            messagesFiles.map((messageFile) =>
                this._messagesCountFromFile(zipFile, messageFile)
            )
        );
        this._messagesCount = filesMessagesCount.reduce((total, each) => {
            return total + each;
        }, 0);
        this.active = this._messagesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No messages detected in your export!";
        }
        return (
            "Found " +
            this._messagesCount +
            " messages from " +
            this._messageThreadsCount +
            " threads"
        );
    }
}

export default MessagesAnalysis;
