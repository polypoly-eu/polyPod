/**
 * Convenience class for compiling missing/unrecognised data reports.
 *
 * @todo This is out of place in poly-analysis; stories being a concept that
 * currently doesn't really exist in this library.
 */
class ReportStories {
    /**
     * Creates a new instance.
     *
     * @param activeReportStories - The report stories to include.
     */
    constructor(activeReportStories) {
        this._activeReportStories = activeReportStories;
    }

    /**
     * The active report stories.
     */
    get activeStories() {
        return this._activeReportStories;
    }

    /**
     * `true` if there are any active report stories, otherwise `false`.
     */
    get active() {
        return this.activeStories.length > 0;
    }

    /**
     * The compiled report data.
     * @type {Object}
     */
    get jsonReport() {
        const jsonStoriesReport = this.activeStories.map(
            (story) => story.jsonReport
        );

        return { reportAnalyses_v2: jsonStoriesReport };
    }
}

export default ReportStories;
