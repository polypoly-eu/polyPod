import React from "react";
import Story from "./story.jsx";

import i18n from "../../i18n.js";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import {
    AdvertisingValueMiniStorySummary,
    AdvertisingValueMiniStoryDetails,
} from "../../components/advertisingValueMiniStory/advertisingValueMiniStory.jsx";

class AdvertisingValueMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [
            analysisKeys.numberInterests,
            analysisKeys.randomAdInterests,
            analysisKeys.sortedAdInterests,
        ];
    }

    get title() {
        return i18n.t("advertisingValueMiniStory:title");
    }

    renderSummary() {
        const randomAdInterests = this.analyses[analysisKeys.randomAdInterests];
        return (
            <AdvertisingValueMiniStorySummary
                randomAdInterests={[...randomAdInterests]}
                numberInterests={this.analyses[analysisKeys.numberInterests]}
            />
        );
    }
    renderDetails() {
        return (
            <AdvertisingValueMiniStoryDetails
                displayData={this.analyses[analysisKeys.sortedAdInterests]}
                numberInterests={this.analyses[analysisKeys.numberInterests]}
            />
        );
    }
}

export default AdvertisingValueMinistory;
