import Story from "./story";

class ReportStory extends Story {
    constructor({ reportAnalyses }) {
        super();
        this._reportAnalyses = reportAnalyses;
        this._neededReports = [];
    }

    get reportAnalyses() {
        return this._reportAnalyses;
    }

    get active() {
        if (!this._neededReports) return true;
        for (const reportKey of this._neededReports) {
            if (!this.reportAnalyses?.[reportKey]) return false;
        }
        return true;
    }

    render() {
        if (this.props.mode === Story.MODES.DETAILS)
            return this.renderDetails();
        return this.renderSummary();
    }
}

export default ReportStory;
