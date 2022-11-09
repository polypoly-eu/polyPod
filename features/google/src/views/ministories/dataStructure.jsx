import React from "react";
import DataStructureMiniStory from "../../components/dataStructureMiniStory/dataStructureMiniStory.jsx";
import { SingleDataStory } from "./singleDataStory.jsx";
import i18n from "!silly-i18n";

//TODO need to be put in poly-analysis & i18n translations
class DataStructureMinistory extends SingleDataStory {
    constructor(props) {
        super(props, "bubblesData");
    }

    get title() {
        return i18n.t("dataStructure:title");
    }

    _renderSummary() {
        let totalFiles = 0;
        this.analysisData.forEach((a) => (totalFiles += a.count));
        return (
            <>
                <p>
                    {i18n.t("dataStructure:summary", {
                        amount_of_folders: this.analysisData.length,
                        amount_of_files: totalFiles,
                    })}
                </p>
                <DataStructureMiniStory data={this.analysisData} />
            </>
        );
    }
}

export default DataStructureMinistory;
