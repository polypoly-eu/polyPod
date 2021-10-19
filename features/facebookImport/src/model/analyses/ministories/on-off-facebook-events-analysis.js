import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";

import RootAnalysis from "./root-analysis.js";
import i18n from "../../../i18n.js";

import {
    OnOffFacebookMiniStorySummary,
    OnOffFacebookMiniStoryDetails,
} from "../../../components/onOffFacebookMiniStory/onOffFacebookMiniStory.jsx";

const secondsPerDay = 86400;

function daysBetween(timestampA, timestampB) {
    return Math.abs(Math.round((timestampA - timestampB) / secondsPerDay));
}

function generate90DaysObject() {
    return Object.fromEntries(
        Array.from({ length: 91 }, (_, i) => i).map((e) => [
            e,
            { on: 0, off: 0 },
        ])
    );
}

export default class OnOffFacebookEventsAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("offFacebookEventsMiniStory:title");
    }

    async analyze({ facebookAccount }) {
        this._companiesCount = facebookAccount.offFacebookCompanies.length;
        this._purchasesCount = facebookAccount.offFacebookCompanies.filter(
            (company) =>
                company.events.find((event) => event.type == "PURCHASE")
        ).length;
        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(facebookAccount);
        const max = Math.max(
            facebookAccount.offFacebookEventsLatestTimestamp,
            facebookAccount.relatedAccountEventLatestTimestamp
        );
        this._commonAdvertisersData = advertiserMatches.map(
            (consolidatedAdvertiser) =>
                consolidatedAdvertiser.last90DaysSummary(max)
        );

        const displayData = {};

        const allCompanies = this._commonAdvertisersData;
        const selectedCompanies = [];

        if (allCompanies.length > 0) {
            //Most events in total
            allCompanies.sort(
                (a, b) =>
                    a.onFacebookTimestamps.length +
                    a.offFacebookTimestamps.length -
                    b.onFacebookTimestamps.length -
                    b.offFacebookTimestamps.length
            );
            selectedCompanies.push(allCompanies.pop());

            //More on than off
            allCompanies.sort(
                (a, b) =>
                    a.onFacebookTimestamps.length -
                    a.offFacebookTimestamps.length -
                    (b.onFacebookTimestamps.length -
                        b.offFacebookTimestamps.length)
            );
            selectedCompanies.push(allCompanies.pop());

            //More off than on
            allCompanies.sort(
                (a, b) =>
                    a.offFacebookTimestamps.length -
                    a.onFacebookTimestamps.length -
                    (b.offFacebookTimestamps.length -
                        b.onFacebookTimestamps.length)
            );
            selectedCompanies.push(allCompanies.pop());
            if (selectedCompanies)
                selectedCompanies.forEach((company) => {
                    displayData[company.name] = generate90DaysObject();
                    for (let offTimestamp of company.offFacebookTimestamps)
                        displayData[company.name][
                            daysBetween(
                                facebookAccount.offFacebookEventsLatestTimestamp,
                                offTimestamp
                            )
                        ].off++;

                    for (let onTimestamp of company.onFacebookTimestamps)
                        displayData[company.name][
                            daysBetween(
                                facebookAccount.offFacebookEventsLatestTimestamp,
                                onTimestamp
                            )
                        ].on++;
                });

            this._displayData = {};
            Object.keys(displayData).forEach((key) => {
                this._displayData[key] = Object.entries(displayData[key]).map(
                    (e) => {
                        return { key: e[0], lower: e[1].on, upper: e[1].off };
                    }
                );
            });
        }
        this.active = this._companiesCount > 0;
    }

    renderSummary() {
        return (
            <OffFacebookMiniStorySummary
                companiesCount={this._companiesCount}
                purchasesCount={this._purchasesCount}
            />
        );
    }

    renderDetails() {
        return <OffFacebookMiniStoryDetails displayData={this._displayData} />;
    }
}
