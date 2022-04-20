import BasicList from "../../components/basicList/basicList.jsx";
import React from "react";
import Story from "./story.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys";

class MissingKnownJSONFilesReport extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.missingKnownFileNames];
    }
    get title() {
        return "Missing known JSON files";
    }

    get reportData() {
        return this.analyses[analysisKeys.missingKnownFileNames];
    }
    render() {
        return (
            <BasicList
                items={this.analyses[analysisKeys.missingKnownFileNames]}
            />
        );
    }
}

export default MissingKnownJSONFilesReport;
