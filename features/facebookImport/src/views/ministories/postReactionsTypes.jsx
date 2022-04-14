import React from "react";

import PostReactionTypesMiniStory from "../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import i18n from "../../i18n";

class PostReactionTypesMinistory extends Story {
    constructor(props) {
        super(props);
    }

    get title() {
        return i18n.t("reactionsMiniStory:title");
    }

    renderSummary() {
        return (
            <PostReactionTypesMiniStory
                reactionData={this._reactionsTypeCountPairs}
            />
        );
    }
}

export default PostReactionTypesMinistory;
