import React from "react";
import { PolyChart } from "@polypoly-eu/poly-look";

import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import RootAnalysis from "./root-analysis";

const reactionEmojiMap = {
    LIKE: "👍",
    LOVE: "\u2764",
    HAHA: "😆",
    CARE: "🤗",
    WOW: "😲",
    SAD: "😢",
    ANGER: "😡",
};

const reactionBackgroundColorMap = {
    LIKE: "#F7FAFC",
    LOVE: "#F7FAFC",
};

export function mapEmojiToReaction(reactions) {
    return reactions.map((reaction) => {
        return {
            title: reactionEmojiMap[reaction.type],
            value: reaction.count,
            background: reactionBackgroundColorMap[reaction.type],
        };
    });
}

export default class PostReactionsTypesAnalysis extends RootAnalysis {
    get title() {
        return "Post Reactions by Type";
    }

    async analyze({ facebookAccount }) {
        this._reactionsTypeCountPairs =
            groupPostReactionsByType(facebookAccount);
        this.active = this._reactionsTypeCountPairs.length > 0;
    }

    renderSummary() {
        return (
            <PolyChart
                type="icon-cluster"
                inputType="font"
                data={mapEmojiToReaction(this._reactionsTypeCountPairs)}
            />
        );
    }
}
