import React from "react";
import BarChart from "../../../components/dataViz/barChart.jsx";
import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import RootAnalysis from "./root-analysis";

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
        return <BarChart data={this._reactionsTypeCountPairs} names="type" />;
    }
}
