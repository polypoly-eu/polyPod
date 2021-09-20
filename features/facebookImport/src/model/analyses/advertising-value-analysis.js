import React from "react";
import RootAnalysis from "./root-analysis.js";
import i18n from "../../i18n.js";

import AdvertisingValueMiniStory from "../../components/advertisingValueMiniStory/advertisingValueMiniStory.jsx";

export default class AdvertisingValueAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("advertisingValueMiniStory:title");
    }

    async analyze({ facebookAccount }) {
        const randomAdInterests = [];
        const numberInterests = facebookAccount.adInterests.length;
        if (numberInterests > 0)
            for (let i = 0; i < 3; i++) {
                const randomIndex = parseInt(
                    Math.random() * facebookAccount.adInterests.length
                );
                randomAdInterests.push(
                    facebookAccount.adInterests[randomIndex]
                );
            }
        this.active = randomAdInterests.length > 0;
        this._randomAdInterests = randomAdInterests;
        this._numberInterests = numberInterests;
    }

    renderSummary() {
        return (
            <AdvertisingValueMiniStory
                randomAdInterests={this._randomAdInterests}
                numberInterests={this._numberInterests}
            />
        );
    }
}
