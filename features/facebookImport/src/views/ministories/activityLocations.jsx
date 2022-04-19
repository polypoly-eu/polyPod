import React from "react";

import BasicDataCountTable from "../../components/basicDataCountTable/basicDataCountTable.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import Story from "./story.jsx";

class ActivityLocationsMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.locationsData];
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
                items={this.account[analysisKeys.locationsData]}
            />
        );
    }
}

export default ActivityLocationsMinistory;
