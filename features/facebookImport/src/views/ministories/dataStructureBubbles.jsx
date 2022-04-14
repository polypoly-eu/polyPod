import React from "react";
import Story from "./story";
import DataStructureMiniStory from "../../components/dataStructureMiniStory/dataStructureMiniStory.jsx";
import i18n from "../../i18n.js";
import analysisKeys from "../../model/analysisKeys";

class DataStructureMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.bubblesData];
    }
    get title() {
        return i18n.t("dataStructureMiniStory:title");
    }

    renderSummary() {
        let totalFiles = 0;
        this.analyses[analysisKeys.bubblesData].forEach(
            (a) => (totalFiles += a.count)
        );
        return (
            <>
                <p>
                    {i18n.t("dataStructureMiniStory:summary", {
                        amount_of_folders:
                            this.analyses[analysisKeys.bubblesData].length,
                        amount_of_files: totalFiles,
                    })}
                </p>
                <DataStructureMiniStory
                    data={this.analyses[analysisKeys.bubblesData]}
                />
            </>
        );
    }
}

export default DataStructureMinistory;
