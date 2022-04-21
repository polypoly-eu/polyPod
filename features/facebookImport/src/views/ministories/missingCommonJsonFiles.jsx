import BasicList from "../../components/basicList/basicList.jsx";
import React from "react";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import ReportStory from "./reportStory.jsx";

class MissingCommonJSONFilesReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.missingCommonFileNames];
    }
    get title() {
        return "Missing common JSON files";
    }

    get reportData() {
        return this.reportAnalyses[analysisKeys.missingCommonFileNames];
    }
    render() {
        return (
            <BasicList
                items={
                    this.dataAccount.analyses[
                        analysisKeys.missingCommonFileNames
                    ]
                }
            />
        );
    }
}

export default MissingCommonJSONFilesReport;
