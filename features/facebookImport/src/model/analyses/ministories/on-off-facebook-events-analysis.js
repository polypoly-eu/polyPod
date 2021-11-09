import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import {
    buildDisplayData,
    selectMeaningfulCompanies,
    top5OffFacebookCompanies,
} from "../utils/on-off-facebook-data-restructuring.js";

import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

import RootAnalysis from "./root-analysis.js";
import i18n from "../../../i18n.js";

import {
    OnOffFacebookMiniStorySummary,
    OnOffFacebookMiniStoryDetails,
    OffFacebookEventsMiniStoryDetails,
} from "../../../components/onOffFacebookMiniStory/onOffFacebookMiniStory.jsx";

const detailDisplayTypes = {
    onOff: "on-off",
    off: "off",
};

export default class OnOffFacebookEventsAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return this._displayType == detailDisplayTypes.off
            ? i18n.t("offFacebookEventsMiniStory:fallback.title")
            : i18n.t("offFacebookEventsMiniStory:title");
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
        if (selectedCompanies.length > 0) {
            this._displayData = buildDisplayData(
                selectedCompanies,
                facebookAccount.offFacebookEventsLatestTimestamp
            );
            this._displayType = detailDisplayTypes.onOff;
        } else if (facebookAccount._offFacebookCompanies.length > 0) {
            this._displayData = {
                companies: top5OffFacebookCompanies(facebookAccount),
                activityTypes: groupOffFacebookEventsByType(
                    facebookAccount
                ).map((e) => {
                    return {
                        ...e,
                        title: e.type,
                    };
                }),
            };
            this._displayType = detailDisplayTypes.off;
        }
        this.active = this._displayData ? true : false;
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
        return this._displayType == detailDisplayTypes.onOff ? (
            <OnOffFacebookMiniStoryDetails displayData={this._displayData} />
        ) : (
            <OffFacebookEventsMiniStoryDetails
                displayData={this._displayData}
            />
        );
    }
}
