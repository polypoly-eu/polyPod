import React from "react";
import { PolyChart } from "@polypoly-eu/poly-look";

import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import RootAnalysis from "./root-analysis";

const reactionEmojiMap = {
    LIKE: "👍",
    LOVE: "\u2764",
    CARE: "🤗",
};

const exampleData = [
    { title: "👍", value: 21, background: true },
    { title: "\u2764", value: 20, background: true },
    { title: "🤗", value: 1 },
    { title: "😊", value: 12 },
];

export default class PostReactionsTypesAnalysis extends RootAnalysis {
    get title() {
        return "Post Reactions by Type";
    }

    async analyze({ facebookAccount }) {
        this._reactionsTypeCountPairs =
            groupPostReactionsByType(facebookAccount);
        this.active = this._reactionsTypeCountPairs.length > 0;
        console.log(this._reactionsTypeCountPairs);
    }

    renderSummary() {
        return (
            <PolyChart
                type="icon-cluster"
                inputType="font"
                data={exampleData}
            />
        );
    }
}
