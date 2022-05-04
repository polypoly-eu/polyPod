import React from "react";
import PostReactionTypesMiniStory from "../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import i18n from "../../i18n";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import { SingleDataStory } from "./singleDataStory.jsx";

class PostReactionTypesMinistory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.reactionsTypeCountPairs);
    }

    get title() {
        return i18n.t("reactionsMiniStory:title");
    }

    _renderSummary() {
        return <PostReactionTypesMiniStory reactionData={this.analysisData} />;
    }
}

export default PostReactionTypesMinistory;
