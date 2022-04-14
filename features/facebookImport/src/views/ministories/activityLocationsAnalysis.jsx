import React from "react";

import BasicDataCountTable from "../../components/basicDataCountTable/basicDataCountTable.jsx";
import Story from "./story.jsx";

class ActivityLocationsAnalysis extends Story {
    constructor(props) {
        super(props);
    }
    state = {};
    get title() {
        return "Session Activity Locations";
    }
    renderSummary() {
        return (
            <BasicDataCountTable
                title={
                    "Locations contained in session activities, like log-in or log-out."
                }
                items={this._locationsData}
            />
        );
    }
}

export default ActivityLocationsAnalysis;
