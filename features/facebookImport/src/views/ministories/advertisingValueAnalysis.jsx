import React from "react";
import Story from "./story";

import i18n from "../../i18n.js";
import {
    AdvertisingValueMiniStorySummary,
    AdvertisingValueMiniStoryDetails,
} from "../../components/advertisingValueMiniStory/advertisingValueMiniStory.jsx";

class AdvertisingValueAnalysis extends Story {
    constructor(props) {
        super(props);
    }
    state = {};

    get title() {
        return i18n.t("advertisingValueMiniStory:title");
    }

    renderSummary() {
        return (
            <AdvertisingValueMiniStorySummary
                randomAdInterests={this.account.randomAdInterests}
                numberInterests={this.account.numberInterests}
            />
        );
    }
    renderDetails() {
        return (
            <AdvertisingValueMiniStoryDetails
                displayData={this.account.displayData}
                numberInterests={this.account.numberInterests}
            />
        );
    }
}

export default AdvertisingValueAnalysis;
