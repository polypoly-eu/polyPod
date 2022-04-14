import React from "react";
import Story from "./story";
import DataStructureMiniStory from "../../components/dataStructureMiniStory/dataStructureMiniStory.jsx";
import i18n from "../../i18n.js";

class DataStructureMinistory extends Story {
    constructor(props) {
        super(props);
    }
    state = {};
    get title() {
        return i18n.t("dataStructureMiniStory:title");
    }

    renderSummary() {
        let totalFiles = 0;
        this.analyses.bubblesData.forEach((a) => (totalFiles += a.count));
        return (
            <>
                <p>
                    {i18n.t("dataStructureMiniStory:summary", {
                        amount_of_folders: this.analyses.bubblesData.length,
                        amount_of_files: totalFiles,
                    })}
                </p>
                <DataStructureMiniStory data={this.analyses.bubblesData} />
            </>
        );
    }
}

export default DataStructureMinistory;
