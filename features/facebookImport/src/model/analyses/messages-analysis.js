import RootAnalysis from "./root-analysis";

export default class MessagesAnalysis extends RootAnalysis {
    get title() {
        return "Messages";
    }

    async parse({ facebookAccount }) {
        this._messageThreadsCount = facebookAccount.messageThreads.length;
        this._messagesCount = facebookAccount.messagesCount;
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
