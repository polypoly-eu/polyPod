import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys.js";
import ReportStory from "./reportStory.jsx";

class OffFacebookEventsTypesReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.offFacebookEventTypes];
    }

    get title() {
        return "Off-Facebook Event Types";
    }

    get reportData() {
        return this.reports[analysisKeys.offFacebookEventTypes];
    }

    _renderSummary() {
        return (
            <BasicList
                title="Types of activities done off-Facebook!"
                items={this.reportData}
            />
        );
    }
}

export default OffFacebookEventsTypesReport;
