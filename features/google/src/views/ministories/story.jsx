import { Component } from "react";

class Story extends Component {
    constructor({ account, mode }) {
        super();
        this.analyses = account.analyses;
        this._neededAnalyses = [];
        this.mode = mode || Story.MODES.SUMMARY;
    }

    get label() {
        return Story.LABELS.NONE;
    }

    setDetailsMode() {
        this.mode = Story.MODES.DETAILS;
    }

    setSummaryMode() {
        this.mode = Story.MODES.SUMMARY;
    }

    get active() {
        if (!this._neededAnalyses) return true;
        for (const analysisKey of this._neededAnalyses) {
            if (this.analyses?.[analysisKey] === undefined) return false;
        }
        return true;
    }

    hasDetails() {
        if (this._renderDetails) return true;
        return false;
    }

    render() {
        if (this.mode === Story.MODES.DETAILS && this._renderDetails)
            return this._renderDetails();
        return this._renderSummary();
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
