import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";

import RootAnalysis from "./root-analysis.js";
import i18n from "../../../i18n.js";

import {
    OffFacebookMiniStorySummary,
    OffFacebookMiniStoryDetails,
} from "../../../components/offFacebookMiniStory/offFacebookMiniStory.jsx";

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

export default class OffFacebookEventsAnalysis extends RootAnalysis {
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

        const companyData = this._commonAdvertisersData.slice(5, 8);
        companyData.forEach((company, i) => {
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
        console.log(this._displayData);
        this.active = this._companiesCount > 0 && advertiserMatches.length > 0;
        this.active = true;
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
