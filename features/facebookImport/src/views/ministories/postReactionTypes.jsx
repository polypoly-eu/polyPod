import React from "react";
import Story from "./story";
import i18n from "../../../i18n";

import PostReactionTypesMiniStory from "../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import analysisKeys from "../../model/analysisKeys";

class PostReactionsTypesAnalysis extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.postReactionsTypes];
    }

    get title() {
        return i18n.t("reactionsMiniStory:title");
    }

    renderSummary() {
        return (
            <PostReactionTypesMiniStory
                reactionData={this.analyses[analysisKeys.postReactionsTypes]}
            />
        );
    }
}

export default PostReactionsTypesAnalysis;
