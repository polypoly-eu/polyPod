import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class PagesOverviewAnalysis extends RootAnalysis {
    get title() {
        return "Pages Overview";
    }

    async analyze({ dataAccount }) {
        this._pagesData = [
            {
                title: "Liked Pages",
                count: dataAccount.likedPages.length,
            },
            {
                title: "Followed Pages",
                count: dataAccount.followedPages.length,
            },

            {
                title: "Recommended Pages",
                count: dataAccount.recommendedPages.length,
            },

            {
                title: "Unfollowed Pages",
                count: dataAccount.unfollowedPages.length,
            },
        ];

        this.active = this._pagesData.some((data) => data.count > 0);
    }

    renderSummary() {
        return <BasicDataCountTable items={this._pagesData} />;
    }
}
