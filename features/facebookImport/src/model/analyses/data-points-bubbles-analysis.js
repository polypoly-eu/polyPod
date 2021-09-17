import React from "react";
import DataOverview from "../../components/ministories/dataOverview/dataOverview.jsx";
import RootAnalysis from "./root-analysis.js";

export default class DataBubblesAnalysis extends RootAnalysis {
    get title() {
        return "Structure of your data";
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
                    Your Facebook data import contains{" "}
                    {this._bubblesData.length} folders and {filesNumber} files.
                </p>
                <DataOverview data={this._bubblesData} />
            </>
        );
    }
}
