import React from "react";
import Story from "./story";

import i18n from "../../i18n.js";
import analysisKeys from "../../model/analysisKeys";
import {
    AdvertisingValueMiniStorySummary,
    AdvertisingValueMiniStoryDetails,
} from "../../components/advertisingValueMiniStory/advertisingValueMiniStory.jsx";

class AdvertisingValueAnalysis extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [
            analysisKeys.randomAdInterests,
            analysisKeys.numberInterests,
            analysisKeys.displayData,
        ];
    }

    get title() {
        return i18n.t("advertisingValueMiniStory:title");
    }

    renderSummary() {
        return (
            <AdvertisingValueMiniStorySummary
                randomAdInterests={this.account[analysisKeys.randomAdInterests]}
                numberInterests={this.account[analysisKeys.numberInterests]}
            />
        );
    }
    renderDetails() {
        return (
            <AdvertisingValueMiniStoryDetails
                displayData={this.account[analysisKeys.displayData]}
                numberInterests={this.account[analysisKeys.numberInterests]}
            />
        );
    }
}

export default AdvertisingValueAnalysis;
