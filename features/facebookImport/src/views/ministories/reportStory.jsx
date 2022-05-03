import Story from "./story.jsx";

class ReportStory extends Story {
    constructor({ account, mode }) {
        super({ account, mode });
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
            if (this.reports?.[reportKey] === undefined) return false;
        }
        return true;
    }
}

export default ReportStory;
