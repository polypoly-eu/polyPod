import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import RootAnalysis from "./root-analysis";

export default class AdViewsAnalysis extends RootAnalysis {
    get title() {
        return "Ad Views";
    }

    async analyze({ facebookAccount }) {
        const relatedAccounts = facebookAccount.relatedAccounts;
        this._advertisersData = relatedAccounts
            .advertisers()
            .map((advertiser) => {
                return {
                    title: advertiser.displayName,
                    count: advertiser.adViewsCount,
                };
            })
            .sort((a, b) => b.count - a.count);

        this._numerOfAdvertisers = this._advertisersData.length;
        this._numberOfAds = relatedAccounts.adsCount;
        this._numberOfAdViews = relatedAccounts.adViewsCount;
        this.active = this._numerOfAdvertisers > 0;
    }

    renderSummary() {
        return (
            <>
                <p>
                    On you timeline {this._numerOfAdvertisers} advertisers shown{" "}
                    {this._numberOfAds} ads {this._numberOfAdViews} times
                </p>
                <p>
                    The list below shows the advertisers from which ads where
                    shown on your timeline, together with the number of times
                    ads from that advertiser were shown to you.
                </p>
                <BasicDataCountTable items={this._advertisersData} />
            </>
        );
    }
}
