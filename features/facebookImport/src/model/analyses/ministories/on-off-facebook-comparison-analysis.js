import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import RootAnalysis from "./root-analysis";
import { MirroredBarChart } from "@polypoly-eu/poly-look";

export default class OnOffFacebookComparisonAnalysis extends RootAnalysis {
    get title() {
        return "Facebook knows what you did elsewhere";
    }

    async analyze({ facebookAccount }) {
        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(facebookAccount);
        this._commonAdvertisersData = advertiserMatches.map(
            (consolidatedAdvertiser) => consolidatedAdvertiser.last90DaysSummary
        );
        this.active = advertiserMatches.length > 0;
        this.active = true;

        this.data = [
            { time: 1, upper: 21, lower: 23 },
            { time: 2, upper: 0, lower: 2 },
            { time: 3, upper: 0, lower: 0 },
            { time: 4, upper: 13, lower: 0 },
            { time: 5, upper: 35, lower: 0 },
            { time: 6, upper: 67, lower: 54 },
            { time: 7, upper: 34, lower: 2 },
            { time: 8, upper: 14, lower: 53 },
            { time: 9, upper: 68, lower: 45 },
            { time: 10, upper: 63, lower: 23 },
            { time: 11, upper: 0, lower: 0 },
            { time: 12, upper: 21, lower: 45 },
        ];
    }

    renderSummary() {
        return (
            <>
                <MirroredBarChart
                    data={this.data}
                    colors={{
                        upperBar: "#EB6561",
                        lowerBar: "#F7FAFC",
                        text: "#A9B6C6",
                    }}
                    width="400"
                    height="200"
                />
            </>
        );
    }
}
