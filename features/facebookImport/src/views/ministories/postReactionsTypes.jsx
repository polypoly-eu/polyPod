import React from "react";
import PostReactionTypesMiniStory from "../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import i18n from "../../i18n";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import Story from "./story.jsx";

class PostReactionTypesMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.reactionsTypeCountPairs];
    }

    get title() {
        return i18n.t("reactionsMiniStory:title");
    }

    renderSummary() {
        return (
            <PostReactionTypesMiniStory
                reactionData={
                    this.analyses[analysisKeys.reactionsTypeCountPairs]
                }
            />
        );
    }
}

export default PostReactionTypesMinistory;
