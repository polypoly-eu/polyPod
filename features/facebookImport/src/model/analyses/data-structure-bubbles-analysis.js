import React from "react";
import DataStructureMiniStory from "../../components/dataStructureMiniStory/dataStructureMiniStory.jsx";
import RootAnalysis from "./root-analysis.js";
import i18n from "../../i18n.js";

export default class DataStructureBubblesAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("dataStructureMiniStory:title");
    }

    async analyze({ facebookAccount }) {
        this._bubblesData = facebookAccount.dataGroups.filter(
            ({ count }) => count > 0
        );

        this.active = this._bubblesData.length > 0;
    }

    renderSummary() {
        let totalFiles = 0;
        this._bubblesData.forEach((a) => (totalFiles += a.count));
        return (
            <>
                <p>
                    {i18n.t("dataStructureMiniStory:summary", {
                        amount_of_folders: this._bubblesData.length,
                        amount_of_files: totalFiles,
                    })}
                </p>
                <DataStructureMiniStory data={this._bubblesData} />
            </>
        );
    }
}
