import React from "react";
import RootAnalysis from "./root-analysis.js";
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

    async analyze({ facebookAccount }) {
        const adInterests = facebookAccount.adInterests;
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
        this._displayData = adInterests.sort((a, b) => (a > b ? 1 : -1));
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
