import BasicList from "../../components/basicList/basicList";
import React from "react";
import Story from "./story";
import analysisKeys from "../../model/analysisKeys";

class MissingKnownJSONFilesMiniStory extends Story {
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

export default MissingKnownJSONFilesMiniStory;
