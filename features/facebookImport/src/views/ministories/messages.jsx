import React from "react";
import Story from "./story.jsx";
import {
    MessagesMiniStoryDetails,
    MessagesMiniStorySummary,
} from "../../components/messagesMiniStory/messagesMiniStory.jsx";
import i18n from "../../i18n";
import analysisKeys from "../../model/analyses/utils/analysisKeys";

class MessagesMinistory extends Story {
    constructor(props) {
        super(props);
        this.neededAnalyses = [
            analysisKeys.messagesThreadsData,
            analysisKeys.messagesCount,
            analysisKeys.totalUsernamesCount,
        ];
    }
    get title() {
        return i18n.t("explore:messages.title");
    }

    _renderSummary() {
        return (
            <MessagesMiniStorySummary
                messagesCount={this.analyses[analysisKeys.messagesCount]}
                messagesThreadsData={
                    this.analyses[analysisKeys.messagesThreadsData]
                }
                totalUsernamesCount={
                    this.analyses[analysisKeys.totalUsernamesCount]
                }
            />
        );
    }

    _renderDetails() {
        return (
            <MessagesMiniStoryDetails
                messagesCount={this.analyses[analysisKeys.messagesCount]}
                messagesThreadsData={
                    this.analyses[analysisKeys.messagesThreadsData]
                }
                totalUsernamesCount={
                    this.analyses[analysisKeys.totalUsernamesCount]
                }
            />
        );
    }
}

export default MessagesMinistory;
