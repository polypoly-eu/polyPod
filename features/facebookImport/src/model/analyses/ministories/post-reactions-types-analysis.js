import React from "react";

import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

import PostReactionTypesMiniStory from "../../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import i18n from "../../../i18n";
import { KNOWN_REACTION_TYPES } from "../../importers/post-reactions-importer";

export default class PostReactionsTypesAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("reactionsMiniStory:title");
    }

    get label() {
        return RootAnalysis.Labels.NONE;
    }

    async analyze({ facebookAccount }) {
        const allReactionsByType = groupPostReactionsByType(facebookAccount);
        this._reactionsTypeCountPairs = allReactionsByType.filter((each) =>
            KNOWN_REACTION_TYPES.includes(each.type)
        );
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
