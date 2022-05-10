import React from "react";
import analysisKeys from "../../model/analyses/analysisKeys.js";
import { SingleDataStory } from "./singleDataStory.jsx";
import { PolyChart } from "@polypoly-eu/poly-look";

const bubbleVizWidth = 400;
const bubbleVizHeight = 400;
const dataBubblesDarkColor = "#0f1938";
const dataBubblesLightColor = "#f7fafc";

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
                <PolyChart
                    type="bubble-cluster"
                    data={this.analysisData}
                    width={bubbleVizWidth}
                    height={bubbleVizHeight}
                    bubbleColor={dataBubblesLightColor}
                    textColor={dataBubblesDarkColor}
                />
            </>
        );
    }
}

export default PlaceVisitsMinistory;
