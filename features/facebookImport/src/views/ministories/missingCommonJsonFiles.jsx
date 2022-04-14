import BasicList from "../../components/basicList/basicList";
import React from "react";
import Story from "./story";
import analysisKeys from "../../model/analysisKeys";

class MissingCommonJSONFilesMinistory extends Story {
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

export default MissingCommonJSONFilesMinistory;
