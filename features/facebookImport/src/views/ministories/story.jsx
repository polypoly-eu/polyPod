import { Component } from "react";

class Story extends Component {
    constructor({ analyses }) {
        super();
        this._analyses = analyses;
        this._neededAnalyses = [];
    }

    get label() {
        return Story.LABELS.NONE;
    }

    get active() {
        if (!this._neededAnalyses) return true;
        for (const analysisKey of this._neededAnalyses) {
            if (!this.analyses?.[analysisKey]) return false;
        }
        return true;
    }

    get analyses() {
        return this._analyses;
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
