import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class PagesOverviewAnalysis extends RootAnalysis {
    get title() {
        return "Pages Overview";
    }

    async analyze({ facebookAccount }) {
        this._pagesData = [
            {
                title: "Liked Pages",
                count: facebookAccount.likedPages.length,
            },
            {
                title: "Followed Pages",
                count: facebookAccount.followedPages.length,
            },

            {
                title: "Recommended Pages",
                count: facebookAccount.recommendedPages.length,
            },

            {
                title: "Unfollowed Pages",
                count: facebookAccount.unfollowedPages.length,
            },
        ];

        this.active = this._pagesData.some((data) => data.count > 0);
    }

    renderSummary() {
        return <BasicDataCountTable items={this._pagesData} />;
    }
}
