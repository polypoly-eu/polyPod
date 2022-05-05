import React from "react";
import Story from "./story.jsx";
import analysisKeys from "../../model/analyses/analysisKeys.js";
import { PlaceVisitsMinistorySummary } from "../../components/placeVisitsMiniStory/placeVisitsMiniStory.jsx";

class PlaceVisitsMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.groupedPlaceVisits];
    }
    get title() {
        return "Place Visits";
    }

    _renderSummary() {
        return (
            <PlaceVisitsMinistorySummary
                placeVisits={this.analyses[analysisKeys.groupedPlaceVisits]}
            />
        );
    }
}

export default PlaceVisitsMinistory;
