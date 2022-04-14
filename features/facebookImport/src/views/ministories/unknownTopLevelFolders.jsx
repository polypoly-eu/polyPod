import BasicList from "../../components/basicList/basicList.jsx";
import React from "react";
import Story from "./story.jsx";
import analysisKeys from "../../model/analysisKeys";

class UnknownTopLevelFoldersMinistory extends Story {
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

export default UnknownTopLevelFoldersMinistory;
