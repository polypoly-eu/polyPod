import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

/**
 * It looks for advertisers that have both on- and off-Facebook events in the data
 * @class OnOffFacebookAdvertisersAnalysis
 */
export default class OnOffFacebookAdvertisersAnalysis extends RootAnalysis {
    /**
     * It returns the title of the page.
     * @methodof OnOffFacebookAdvertisersAnalysis
     * @returns The title of the page.
     */
    get title() {
        return "On and Off-Facebook Advertisers";
    }

    /**
     * It takes a data account, finds all the advertisers that have both on- and off-Facebook data, and
     * returns a list of those advertisers
     * @methodof OnOffFacebookAdvertisersAnalysis
     * @param {dataAccount} - A data account of user
     * @returns A list of advertisers
     */
    async analyze({ dataAccount }) {
        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(dataAccount);
        this._commonAdvertisersData = advertiserMatches
            .map((consolidatedAdvertiser) => consolidatedAdvertiser.fullSummary)
            .filter(
                (summary) =>
                    summary.onFacebookTimestamps.length > 0 &&
                    summary.offFacebookTimestamps.length > 0
            );
        this.active = this._commonAdvertisersData.length > 0;
    }

    /**
     * It returns a React component that renders a paragraph and a table
     * @methodof OnOffFacebookAdvertisersAnalysis
     * @returns A React fragment.
     */
    renderSummary() {
        return (
            <>
                <p>
                    Advertisers for which we detected events both on and
                    off-Facebook. The list below shows the number of on and
                    off-Facebook events for each advertiser.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>On-Facebook Events</th>
                            <th>Off-Facebook Events</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._commonAdvertisersData.map(
                            (
                                {
                                    name,
                                    onFacebookTimestamps,
                                    offFacebookTimestamps,
                                },
                                index
                            ) => (
                                <tr key={index}>
                                    <td>{name}</td>
                                    <td>{onFacebookTimestamps.length}</td>
                                    <td>{offFacebookTimestamps.length}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </>
        );
    }
}
