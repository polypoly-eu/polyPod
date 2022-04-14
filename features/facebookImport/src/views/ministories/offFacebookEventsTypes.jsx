import React from "react";
import Story from "./story.jsx";

import BasicDataCountTable from "../../components/postReactionTypesMiniStory/postReactionTypesMiniStory.jsx";
import analysisKeys from "../../model/analysisKeys";

class OffFacebookEventsTypesMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.eventsTypeCountPairs];
    }
    get title() {
        return "Off-Facebook Events by Type";
    }

    renderSummary() {
        <BasicDataCountTable
            items={this._analyses[analysisKeys.eventsTypeCountPairs]}
        />;
    }
}

export default OffFacebookEventsTypesMinistory;
