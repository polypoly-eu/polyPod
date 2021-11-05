import React from "react";

import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import RootAnalysis from "./root-analysis";

import PostReactionTypesMiniStory from "../../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import i18n from "../../../i18n";

export default class PostReactionsTypesAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("reactionsMiniStory:title");
    }

    get label() {
        return RootAnalysis.Labels.NONE;
    }

    async analyze({ facebookAccount }) {
        this._reactionsTypeCountPairs =
            groupPostReactionsByType(facebookAccount);
        this.active = this._reactionsTypeCountPairs.length > 0;
    }

    renderSummary() {
        return (
            <PostReactionTypesMiniStory
                reactionData={this._reactionsTypeCountPairs}
            />
        );
    }
}
