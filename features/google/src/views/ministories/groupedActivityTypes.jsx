import React from "react";
import { SingleDataStory } from "./singleDataStory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys";
import FilterChipBubbles from "../../components/filterChipBubbles/filterChipBubbles.jsx";

class GroupedActivityTypesStory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.groupedActivityTypes);
    }

    _renderSummary() {
        const data = Object.entries(this.analysisData).map(([key, value]) => ({
            title: key,
            value,
        }));
        return (
            <div>
                <h1>Grouped Activity Types</h1>
                <FilterChipBubbles data={data} />
            </div>
        );
    }
}

export default GroupedActivityTypesStory;
