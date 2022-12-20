import React from "react";
import Story from "./story.jsx";

import i18n from "!silly-i18n";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import {
    AdvertisingValueMiniStorySummary,
    AdvertisingValueMiniStoryDetails,
} from "../../components/advertisingValueMiniStory/advertisingValueMiniStory.jsx";

class AdvertisingValueMinistory extends Story {
    constructor(props) {
        super(props);
        this.neededAnalyses = [
            analysisKeys.numberInterests,
            analysisKeys.randomAdInterests,
            analysisKeys.sortedAdInterests,
        ];
    }

    get title() {
        return i18n.t("advertisingValueMiniStory:title");
    }

    _renderSummary() {
        const randomAdInterests = this.analyses[analysisKeys.randomAdInterests];
        return (
            <AdvertisingValueMiniStorySummary
                randomAdInterests={[...randomAdInterests]}
                numberInterests={this.analyses[analysisKeys.numberInterests]}
            />
        );
    }
    _renderDetails() {
        return (
            <AdvertisingValueMiniStoryDetails
                displayData={this.analyses[analysisKeys.sortedAdInterests]}
                numberInterests={this.analyses[analysisKeys.numberInterests]}
            />
        );
    }
}

export default AdvertisingValueMinistory;
