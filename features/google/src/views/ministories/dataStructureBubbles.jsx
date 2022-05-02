import React from "react";
import DataStructureMiniStory from "../../components/dataStructureMiniStory/dataStructureMiniStory.jsx";
import i18n from "../../i18n.js";
import { SingleDataStory } from "./singleDataStory.jsx";

//TODO need to be put in poly-analysis
class DataStructureMinistory extends SingleDataStory {
    constructor(props) {
        super(props, "bubblesData");
    }
    get title() {
        return i18n.t("dataStructureMiniStory:title");
    }

    renderSummary() {
        let totalFiles = 0;
        this.analysisData.forEach((a) => (totalFiles += a.count));
        return (
            <>
                <p>
                    {i18n.t("dataStructureMiniStory:summary", {
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
