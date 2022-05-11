import React from "react";
import { SingleDataStory } from "./singleDataStory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys";
import FilterChipBubbles from "../../components/filterChipBubbles/filterChipBubbles.jsx";
import { mapToChartDataArray } from "@polypoly-eu/poly-look";

class GroupedActivityTypesStory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.groupedActivityTypes);
    }

    _renderSummary() {
        return (
            <>
                <h1>Grouped Activity Types</h1>
                <FilterChipBubbles
                    data={mapToChartDataArray(this.analysisData)}
                />
            </>
        );
    }
}

export default GroupedActivityTypesStory;
