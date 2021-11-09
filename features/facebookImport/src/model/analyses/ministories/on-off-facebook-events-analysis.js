import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import {
    buildDisplayData,
    selectMeaningfulCompanies,
} from "../utils/on-off-facebook-data-restructuring.js";

import RootAnalysis from "./root-analysis.js";
import i18n from "../../../i18n.js";

import {
    OnOffFacebookMiniStorySummary,
    OnOffFacebookMiniStoryDetails,
} from "../../../components/onOffFacebookMiniStory/onOffFacebookMiniStory.jsx";

export default class OnOffFacebookEventsAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("offFacebookEventsMiniStory:title");
    }

    async analyze({ facebookAccount }) {
        this._companiesCount = facebookAccount.offFacebookCompanies.length;

        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(facebookAccount);

        this._companiesWithAdsCount = advertiserMatches.reduce(
            (total, consolidatedCompany) =>
                total + consolidatedCompany.offFacebookCompaniesCount,
            0
        );
        const max = Math.max(
            facebookAccount.offFacebookEventsLatestTimestamp,
            facebookAccount.relatedAccountEventLatestTimestamp
        );
        this._commonAdvertisersData = advertiserMatches.map(
            (consolidatedAdvertiser) =>
                consolidatedAdvertiser.last90DaysSummary(max)
        );

        const selectedCompanies = selectMeaningfulCompanies(
            this._commonAdvertisersData
        );

        this._displayData = buildDisplayData(
            selectedCompanies,
            facebookAccount.offFacebookEventsLatestTimestamp
        );

        this.active = this._companiesCount > 0;
    }

    renderSummary() {
        return (
            <OnOffFacebookMiniStorySummary
                companiesCount={this._companiesCount}
                companiesWithAdsCount={this._companiesWithAdsCount}
            />
        );
    }

    renderDetails() {
        return (
            <OnOffFacebookMiniStoryDetails displayData={this._displayData} />
        );
    }
}
