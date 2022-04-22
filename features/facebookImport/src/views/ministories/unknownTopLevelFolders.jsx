import BasicList from "../../components/basicList/basicList.jsx";
import React from "react";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import ReportStory from "./reportStory.jsx";

class UnknownTopLevelFoldersReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.unknownFolderNames];
    }
    get title() {
        return "Unknown top-level folders";
    }

    get reportData() {
        return this.reports[analysisKeys.unknownFolderNames];
    }

    render() {
        return <BasicList items={this.reportData} />;
    }
}

export default UnknownTopLevelFoldersReport;
