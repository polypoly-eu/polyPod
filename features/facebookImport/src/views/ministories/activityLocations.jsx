import React from "react";

import BasicDataCountTable from "../../components/basicDataCountTable/basicDataCountTable.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import { SingleDataStory } from "./singleDataStory.jsx";

class ActivityLocationsMinistory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.locationsData);
    }
    get title() {
        return "Session Activity Locations";
    }
    renderSummary() {
        return (
            <BasicDataCountTable
                title={
                    "Locations contained in session activities, like log-in or log-out."
                }
                items={this.analysisData}
            />
        );
    }
}

export default ActivityLocationsMinistory;
