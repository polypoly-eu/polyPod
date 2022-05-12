import { mapToChartDataArray, PolyChart } from "@polypoly-eu/poly-look";
import React from "react";
import analysisKeys from "../../model/analyses/analysisKeys.js";
import { SingleDataStory } from "./singleDataStory.jsx";

const barColor = "#f7fafc";
const barValueColor = "#0f1938";

class ActivitiesByProductsStory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.activitiesByProducts);
    }
    _renderSummary() {
        return (
            <>
                <h1>Activities by products</h1>
                <PolyChart
                    type="horizontal-bar-chart"
                    data={mapToChartDataArray(this.analysisData)}
                    barColor={barColor}
                    barValueColor={barValueColor}
                    barLabelColor={barColor}
                    height={800}
                />
            </>
        );
    }
}

export default ActivitiesByProductsStory;
