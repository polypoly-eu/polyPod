import React from "react";

import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

import PostReactionTypesMiniStory from "../../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import i18n from "../../../i18n";
import { KNOWN_REACTION_TYPES } from "../../importers/post-reactions-importer";

export default class PostReactionsTypesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        const allReactionsByType = groupPostReactionsByType(dataAccount);
        this._reactionsTypeCountPairs = allReactionsByType.filter((each) =>
            KNOWN_REACTION_TYPES.includes(each.type)
        );
        this.active = this._reactionsTypeCountPairs.length > 0;
    }
}
