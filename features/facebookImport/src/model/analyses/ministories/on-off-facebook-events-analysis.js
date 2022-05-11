import { linkRelatedAccountsWithOffFacebookCompanies } from "../utils/on-off-events-matching.js";
import {
    buildDisplayData,
    selectMeaningfulCompanies,
    topOffFacebookCompanies,
} from "../utils/on-off-facebook-data-restructuring.js";

import { groupOffFacebookEventsByType } from "../utils/on-off-facebook-events-utils.js";

import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

const detailDisplayTypes = {
    onOff: "on-off",
    off: "off",
};

export default class OnOffFacebookEventsAnalysis extends RootAnalysis {
    get customReportData() {
        return { displayType: this._displayType };
    }

    async analyze({ dataAccount }) {
        dataAccount.analyses[analysisKeys.companiesCount] =
            dataAccount.offFacebookCompaniesCount;

        const advertiserMatches =
            linkRelatedAccountsWithOffFacebookCompanies(dataAccount);

        dataAccount.analyses[analysisKeys.companiesWithAdsCount] =
            advertiserMatches.reduce(
                (total, consolidatedCompany) =>
                    total + consolidatedCompany.offFacebookCompaniesCount,
                0
            );
        const max = Math.max(
            dataAccount.offFacebookEventsLatestTimestamp,
            dataAccount.relatedAccountEventLatestTimestamp
        );
        const commonAdvertisersData = advertiserMatches.map(
            (consolidatedAdvertiser) =>
                consolidatedAdvertiser.last90DaysSummary(max)
        );

        dataAccount.analyses[analysisKeys.commonAdvertisersData] =
            commonAdvertisersData;

        const selectedCompanies = selectMeaningfulCompanies(
            commonAdvertisersData
        );

        const onOffEvents = {};
        onOffEvents.displayData = {};

        if (dataAccount.offFacebookCompanies.length > 0) {
            onOffEvents.displayData.offEvents = {
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
            onOffEvents.displayData.onOffEvents = buildDisplayData(
                selectedCompanies,
                dataAccount.offFacebookEventsLatestTimestamp
            );
        }
        onOffEvents.displayType = onOffEvents.displayData?.onOffEvents
            ? detailDisplayTypes.onOff
            : detailDisplayTypes.off;

        this._displayType = onOffEvents.displayType;

        if (Object.keys(onOffEvents.displayData).length > 0) {
            dataAccount.analyses[analysisKeys.onOffEvents] = onOffEvents;
        }
    }
}
