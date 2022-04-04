import React from "react";
import BasicDataCountTable from "../../../components/basicDataCountTable/basicDataCountTable.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class AdViewsAnalysis extends RootAnalysis {
    get title() {
        return "Ad Views";
    }

    async analyze({ dataAccount }) {
        const relatedAccounts = dataAccount.relatedAccounts;
        this._advertisersData = relatedAccounts
            .advertisers()
            .map((advertiser) => {
                return {
                    title: advertiser.displayName,
                    count: advertiser.adViewsCount,
                };
            })
            .sort((a, b) => b.count - a.count);

        this._numberOfAdvertisers = this._advertisersData.length;
        this._numberOfAds = relatedAccounts.adsCount;
        this._numberOfAdViews = relatedAccounts.adViewsCount;
        this.active = this._numberOfAdvertisers > 0;
    }

    renderSummary() {
        return (
            <>
                <p>
                    On your timeline {this._numberOfAdvertisers}{" "}
                    {this._numberOfAdvertisers === 1
                        ? "advertiser has"
                        : "advertisers have"}{" "}
                    shown {this._numberOfAds}{" "}
                    {this._numberOfAds === 1 ? "ad" : "ads"}{" "}
                    {this._numberOfAdViews}{" "}
                    {this._numberOfAdViews === 1 ? "time" : "times"}
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
