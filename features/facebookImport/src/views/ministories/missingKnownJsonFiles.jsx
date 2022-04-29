import BasicList from "../../components/basicList/basicList.jsx";
import React from "react";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import ReportStory from "./reportStory.jsx";

class MissingKnownJSONFilesReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.missingKnownFileNames];
    }
    get title() {
        return "Missing known JSON files";
    }

    get reportData() {
        return this.reports[analysisKeys.missingKnownFileNames];
    }

    render() {
        return <BasicList items={this.reportData} />;
    }
}

export default MissingKnownJSONFilesReport;
