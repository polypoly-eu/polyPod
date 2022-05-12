import React from "react";
import analysisKeys from "../../model/analyses/analysisKeys.js";
import { SingleDataStory } from "./singleDataStory.jsx";
import FilterChipBubbles from "../../components/filterChipBubbles/filterChipBubbles.jsx";

class PlaceVisitsMinistory extends SingleDataStory {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.groupedPlaceVisits];
    }
    get title() {
        return "Place Visits";
    }

    _renderSummary() {
        return (
            <>
                <p> The Places you visited</p>
                <FilterChipBubbles data={this.analysisData} />
            </>
        );
    }
}

export default PlaceVisitsMinistory;
