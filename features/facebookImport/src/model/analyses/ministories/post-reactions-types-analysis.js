import React from "react";
import { PolyChart } from "@polypoly-eu/poly-look";

import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import RootAnalysis from "./root-analysis";

import likeIcon from "../../../static/images/reactions-ministory/like.svg";
import loveIcon from "../../../static/images/reactions-ministory/love.svg";
import hahaIcon from "../../../static/images/reactions-ministory/haha.svg";
import careIcon from "../../../static/images/reactions-ministory/care.svg";
import wowIcon from "../../../static/images/reactions-ministory/wow.svg";
import sadIcon from "../../../static/images/reactions-ministory/sad.svg";
import angerIcon from "../../../static/images/reactions-ministory/anger.svg";

const reactionEmoji = {
    LIKE: likeIcon,
    LOVE: loveIcon,
    HAHA: hahaIcon,
    CARE: careIcon,
    WOW: wowIcon,
    SAD: sadIcon,
    ANGER: angerIcon,
};

export function mapEmojiToReaction(reactions) {
    return reactions.map((reaction) => {
        return {
            title: "icon",
            value: reaction.count,
            icon: reactionEmoji[reaction.type],
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
