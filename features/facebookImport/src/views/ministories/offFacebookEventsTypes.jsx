import React from "react";
import Story from "./story.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys.js";

class OffFacebookEventsTypesReport extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.offFacebookEventTypes];
    }

    get title() {
        return "Off-Facebook Event Types";
    }

    render() {
        return (
            <BasicList
                title="Types of activities done off-Facebook!"
                items={this.account[analysisKeys.offFacebookEventTypes]}
            />
        );
    }
}

export default OffFacebookEventsTypesReport;
