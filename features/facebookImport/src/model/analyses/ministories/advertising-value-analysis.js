import React from "react";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import i18n from "../../../i18n.js";

import {
    AdvertisingValueMiniStorySummary,
    AdvertisingValueMiniStoryDetails,
} from "../../../components/advertisingValueMiniStory/advertisingValueMiniStory.jsx";

export default class AdvertisingValueAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("advertisingValueMiniStory:title");
    }

    async analyze({ dataAccount }) {
        const adInterests = dataAccount.adInterests;
        const numberInterests = new Set(adInterests).size;
        const randomAdInterests = new Set();
        this.active = false;
        if (numberInterests > 0) {
            while (randomAdInterests.size < Math.min(3, numberInterests)) {
                randomAdInterests.add(
                    adInterests[Math.floor(Math.random() * adInterests.length)]
                );
            }
            this.active = true;
        }
        this._randomAdInterests = [...randomAdInterests];
        this._numberInterests = numberInterests;
        this._displayData = adInterests.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
    }

    renderSummary() {
        return (
            <AdvertisingValueMiniStorySummary
                randomAdInterests={this._randomAdInterests}
                numberInterests={this._numberInterests}
            />
        );
    }
    renderDetails() {
        return (
            <AdvertisingValueMiniStoryDetails
                displayData={this._displayData}
                numberInterests={this._numberInterests}
            />
        );
    }
}
