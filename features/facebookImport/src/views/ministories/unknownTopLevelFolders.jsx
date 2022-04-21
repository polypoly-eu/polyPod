import BasicList from "../../components/basicList/basicList.jsx";
import React from "react";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import ReportStory from "./reportStory.jsx";

class UnknownTopLevelFoldersReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.unknownFolderNames];
    }
    get title() {
        return "Unknown top-level folders";
    }

    get reportData() {
        return this.analyses[analysisKeys.unknownFolderNames];
    }

    render() {
        return (
            <BasicList items={this.analyses[analysisKeys.unknownFolderNames]} />
        );
    }
}

export default UnknownTopLevelFoldersReport;
