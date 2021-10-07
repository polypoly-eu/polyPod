import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import RootAnalysis from "./root-analysis";

export default class OnOffFacebookAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return "On and Off-Facebook Advertisers";
    }

    async analyze({ facebookAccount }) {
        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(facebookAccount);
        this._commonAdvertisersData = advertiserMatches.map(
            (consolidatedAdvertiser) => consolidatedAdvertiser.last90DaysSummary
        );
        this.active = advertiserMatches.length > 0;
    }

    renderSummary() {
        return (
            <>
                <p>
                    Advertisers for which we detected events both on and off
                    Facebook
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>On-Facebook</th>
                            <th>Off-Facebook</th>
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
