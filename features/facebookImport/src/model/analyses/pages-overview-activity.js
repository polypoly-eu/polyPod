import React from "react";
import RootAnalysis from "./root-analysis.js";

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

    render() {
        if (!this.active) {
            return "No Pages Information!";
        }
        return (
            <table>
                <tbody>
                    {this._pagesData.map(({ title, count }, index) => (
                        <tr key={index}>
                            <td>{title}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
