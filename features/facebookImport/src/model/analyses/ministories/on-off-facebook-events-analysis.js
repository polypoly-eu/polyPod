import React from "react";
import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import {
    buildDisplayData,
    selectMeaningfulCompanies,
    topOffFacebookCompanies,
} from "../utils/on-off-facebook-data-restructuring.js";

import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import i18n from "../../../i18n.js";

import {
    OnOffFacebookMiniStorySummary,
    OnOffFacebookMiniStoryDetails,
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
        return i18n.t("offFacebookEventsMiniStory:off.events.title");
    }

    get customReportData() {
        return { displayType: this._displayType };
    }

    async analyze({ dataAccount }) {
        this._companiesCount = dataAccount.offFacebookCompanies.length;

        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(dataAccount);

        this._companiesWithAdsCount = advertiserMatches.reduce(
            (total, consolidatedCompany) =>
                total + consolidatedCompany.offFacebookCompaniesCount,
            0
        );
        const max = Math.max(
            dataAccount.offFacebookEventsLatestTimestamp,
            dataAccount.relatedAccountEventLatestTimestamp
        );
        this._commonAdvertisersData = advertiserMatches.map(
            (consolidatedAdvertiser) =>
                consolidatedAdvertiser.last90DaysSummary(max)
        );

        const selectedCompanies = selectMeaningfulCompanies(
            this._commonAdvertisersData
        );

        this._displayData = {};

        if (dataAccount._offFacebookCompanies.length > 0) {
            this._displayData.offEvents = {
                companies: topOffFacebookCompanies(dataAccount),
                activityTypes: groupOffFacebookEventsByType(dataAccount).map(
                    (e) => {
                        return {
                            ...e,
                            title: e.type,
                        };
                    }
                ),
            };
        }

        if (selectedCompanies.length > 0) {
            this._displayData.onOffEvents = buildDisplayData(
                selectedCompanies,
                dataAccount.offFacebookEventsLatestTimestamp
            );
        }
        this.active = Object.keys(this._displayData).length > 0;
        this._displayType = this._displayData?.onOffEvents
            ? detailDisplayTypes.onOff
            : detailDisplayTypes.off;
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
