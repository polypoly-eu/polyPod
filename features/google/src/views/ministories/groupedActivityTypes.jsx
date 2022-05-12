import React from "react";
import { SingleDataStory } from "./singleDataStory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys";
import FilterChipBubbles from "../../components/filterChipBubbles/filterChipBubbles.jsx";
import { mapToChartDataArray } from "@polypoly-eu/poly-look";

class GroupedActivityTypesStory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.groupedActivityTypes);
    }

    get title() {
        return "Grouped Activity Types";
    }

    get label() {
        return SingleDataStory.LABELS.TECH_DEMO;
    }

    _renderSummary() {
        return (
            <FilterChipBubbles data={mapToChartDataArray(this.analysisData)} />
        );
    }
}

export default GroupedActivityTypesStory;
