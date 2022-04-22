export default class ReportStories {
    constructor(activeReportStories) {
        this._activeReportStories = activeReportStories;
    }

    get activeStories() {
        return this._activeReportStories;
    }

    get jsonReport() {
        const jsonStoriesReport = this.activeStories.map(
            (story) => story.jsonReport
        );

        return { reportAnalyses_v1: jsonStoriesReport };
    }
}
