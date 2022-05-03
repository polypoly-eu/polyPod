import React from "react";
import DataStructureMiniStory from "../../components/dataStructureMiniStory/dataStructureMiniStory.jsx";
import i18n from "../../i18n.js";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import { SingleDataStory } from "./singleDataStory.jsx";

class DataStructureMinistory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.bubblesData);
    }
    get title() {
        return i18n.t("dataStructureMiniStory:title");
    }

    _renderSummary() {
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
