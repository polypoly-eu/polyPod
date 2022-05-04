//TODO: Use DataAccount super class
export default class GoogleAccount {
    constructor() {
        this.importingResults = [];
        this._importedFileNames = [];

        this.name = "";
        this.preferredLanguage = [];
        this.analyses = {};
        this.reports = {};
        this.analysesExecutionResults = [];
        this.placeVisits = [];
        this.activitySegments = [];
        this.activities = [];
        this.pathNames = [];
    }

    get importedFileNames() {
        return this._importedFileNames;
    }

    addImportedFileName(fileName) {
        this._importedFileNames.push(fileName);
    }

    get dataGroups() {
        return [
            {
                title: "Place Visits",
                count: this.placeVisits.length,
            },
            {
                title: "Activity Segments",
                count: this.activitySegments.length,
            },
            {
                title: "Acitivities",
                count: this.activities.length,
            },
        ];
    }
}
