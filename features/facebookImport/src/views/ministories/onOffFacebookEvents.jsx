import React from "react";
import i18n from "../../i18n.js";

import {
    OnOffFacebookMiniStorySummary,
    OnOffFacebookMiniStoryDetails,
} from "../../components/onOffFacebookMiniStory/onOffFacebookMiniStory.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import Story from "./story.jsx";

class OnOffFacebookEventsMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [
            analysisKeys.companiesCount,
            analysisKeys.companiesWithAdsCount,
            analysisKeys.onOffEvents,
        ];
    }
    get title() {
        return i18n.t("offFacebookEventsMiniStory:off.events.title");
    }

    _renderSummary() {
        return (
            <OnOffFacebookMiniStorySummary
                companiesCount={this.analyses[analysisKeys.companiesCount]}
                companiesWithAdsCount={
                    this.analyses[analysisKeys.companiesWithAdsCount]
                }
            />
        );
    }

    renderDetails() {
        return (
            <OnOffFacebookMiniStoryDetails
                displayData={
                    this.analyses[analysisKeys.onOffEvents].displayData
                }
            />
        );
    }
}

export default OnOffFacebookEventsMinistory;
