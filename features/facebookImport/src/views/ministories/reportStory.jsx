import Story from "./story.jsx";

class ReportStory extends Story {
    constructor(account) {
        super(account);
        this._reports = account.reports;
        this._neededReports = [];
    }

    get reports() {
        return this._reports;
    }

    get jsonReport() {
        return {
            id: this.id,
            data: this.reportData || null,
        };
    }

    get id() {
        return this.constructor.name;
    }

    get active() {
        if (!this._neededReports) return true;
        for (const reportKey of this._neededReports) {
            if (!this.reports?.[reportKey]) return false;
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
