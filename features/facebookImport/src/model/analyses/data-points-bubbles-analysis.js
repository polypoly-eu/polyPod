import React from "react";
import DataOverviewMiniStory from "../../components/dataOverviewMiniStory/dataOverviewMiniStory.jsx";
import RootAnalysis from "./root-analysis.js";
import i18n from "../../i18n.js";

export default class DataBubblesAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("dataOverviewMiniStory:title");
    }

    _computeScaleFactor(bubblesData) {
        let maximumSize = Math.max(...bubblesData.map(({ count }) => count));
        if (maximumSize < 100) maximumSize = 100;
        let currentFactor = 1;
        while (!(maximumSize / currentFactor < 100)) {
            currentFactor = currentFactor + 10;
        }
        return currentFactor;
    }

    async analyze({ facebookAccount }) {
        this._bubblesData = facebookAccount.dataGroups.filter(
            ({ count }) => count > 0
        );

        const scaleFactor = this._computeScaleFactor(this._bubblesData);
        this._bubblesDataScaled = this._bubblesData.map(({ count, title }) => {
            return { title, count: count / scaleFactor };
        });

        this.active = this._bubblesData.length > 0;
    }

    renderSummary() {
        let filesNumber = 0;
        this._bubblesData.forEach((a) => (filesNumber += a.count));
        return (
            <>
                <p>
                    {i18n.t("dataOverviewMiniStory:summary", {
                        number_folders: this._bubblesData.length,
                        number_files: filesNumber,
                    })}
                </p>
                <DataOverviewMiniStory data={this._bubblesData} />
            </>
        );
    }
}
