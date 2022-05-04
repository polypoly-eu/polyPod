import React from "react";
import DataStructureMiniStory from "../../components/dataStructureMiniStory/dataStructureMiniStory.jsx";
import { SingleDataStory } from "./singleDataStory.jsx";

//TODO need to be put in poly-analysis & i18n translations
class DataStructureMinistory extends SingleDataStory {
    constructor(props) {
        super(props, "bubblesData");
    }
    get title() {
        return "DataStructure Ministory";
    }

    _renderSummary() {
        let totalFiles = 0;
        this.analysisData.forEach((a) => (totalFiles += a.count));
        return (
            <>
                <p>
                    {`Here is the data your account holds: 
                    Datapoints: ${this.analysisData.length},
                     Amount of files: ${totalFiles}`}
                </p>
                <DataStructureMiniStory data={this.analysisData} />
            </>
        );
    }
}

export default DataStructureMinistory;
