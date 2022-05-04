import Story from "./story.jsx";

class ReportStory extends Story {
    constructor({ account, mode }) {
        super({ account, mode });
        this.reports = account.reports;
        this.neededReports = [];
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
        if (!this.neededReports) return true;
        for (const reportKey of this.neededReports) {
            if (this.reports?.[reportKey] === undefined) return false;
        }
        return true;
    }
}

export default ReportStory;
