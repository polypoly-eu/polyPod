import React from "react";
import ExploreDataButtons from "../../components/buttons/exploreDataButtons/exploreDataButtons.jsx";
import RootAnalysis from "./root-analysis.js";

export default class DataBubblesAnalysis extends RootAnalysis {
    get title() {
        return "Data Bubbles";
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
        return (
            <>
                <ExploreDataButtons data={this._bubblesDataScaled} />
            </>
        );
    }
}
