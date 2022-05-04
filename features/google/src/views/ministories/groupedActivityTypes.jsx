import React from "react";
import { SingleDataStory } from "./singleDataStory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys";
import { PolyChart } from "@polypoly-eu/poly-look";

const bubbleVizWidth = 400;
const bubbleVizHeight = 400;
const dataBubblesDarkColor = "#0f1938";
const dataBubblesLightColor = "#f7fafc";

class GroupedActivityTypesStory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.groupedActivityTypes);
    }

    _renderSummary() {
        const data = Object.entries(this.analysisData).map(([key, value]) => ({
            title: key,
            count: value,
        }));
        return (
            <div>
                <h1>Grouped Activity Types</h1>
                <PolyChart
                    type="bubble-cluster"
                    data={data}
                    width={bubbleVizWidth}
                    height={bubbleVizHeight}
                    bubbleColor={dataBubblesLightColor}
                    textColor={dataBubblesDarkColor}
                />
            </div>
        );
    }
}

export default GroupedActivityTypesStory;
