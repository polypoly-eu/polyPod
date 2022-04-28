import { Component } from "react";

class Story extends Component {
    constructor({ processedData }) {
        super();
        this._analyses = processedData;
        this._neededAnalyses = [];
    }

    get label() {
        return Story.LABELS.NONE;
    }

    get analyses() {
        return this._analyses;
    }

    get active() {
        if (!this._neededAnalyses) return true;
        for (const analysisKey of this._neededAnalyses) {
            if (this.analyses?.[analysisKey] === null) return false;
        }
        return true;
    }

    render() {
        if (this.props.mode === Story.MODES.DETAILS)
            return this.renderDetails();
        return this.renderSummary();
    }
}

export default Story;

Story.LABELS = Object.freeze({
    NONE: null,
    TECH_DEMO: "techDemo",
});

Story.MODES = Object.freeze({
    DETAILS: "details",
    SUMMARY: "summary",
});
