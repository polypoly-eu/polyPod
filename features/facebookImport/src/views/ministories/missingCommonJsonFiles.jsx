import BasicList from "../../components/basicList/basicList.jsx";
import React from "react";
import Story from "./story.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys";

class MissingCommonJSONFilesReport extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.missingCommonFileNames];
    }
    get title() {
        return "Missing common JSON files";
    }

    get reportData() {
        return this.analyses[analysisKeys.missingCommonFileNames];
    }
    render() {
        return (
            <BasicList
                items={this.analyses[analysisKeys.missingCommonFileNames]}
            />
        );
    }
}

export default MissingCommonJSONFilesReport;
