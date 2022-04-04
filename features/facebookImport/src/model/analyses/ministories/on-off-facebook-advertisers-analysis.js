import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class OnOffFacebookAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return "On and Off-Facebook Advertisers";
    }

    async analyze({ facebookAccount }) {
        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(facebookAccount);
        this._commonAdvertisersData = advertiserMatches
            .map((consolidatedAdvertiser) => consolidatedAdvertiser.fullSummary)
            .filter(
                (summary) =>
                    summary.onFacebookTimestamps.length > 0 &&
                    summary.offFacebookTimestamps.length > 0
            );
        this.active = this._commonAdvertisersData.length > 0;
    }

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
