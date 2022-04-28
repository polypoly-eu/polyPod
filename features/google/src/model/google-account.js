//TODO: Use DataAccount super class
export default class GoogleAccount {
    constructor() {
        this._importingResults = [];
        this._importedFileNames = [];

        this._name = "";
        this._preferredLanguage = [];
        this._analyses = {};
        this._reports = {};
        this._analysesExecutionResults = [];
        this._placeVisits = [];
        this._activitySegments = [];
        this._activities = [];
        this._pathNames = [];
    }

    get analyses() {
        return this._analyses;
    }

    get reports() {
        return this._reports;
    }

    get importedFileNames() {
        return this._importedFileNames;
    }

    addImportedFileName(fileName) {
        this._importedFileNames.push(fileName);
    }

    get importingResults() {
        return this._importingResults;
    }

    set importingResults(importingResults) {
        this._importingResults = importingResults;
    }

    get analysesExecutionResults() {
        return this._analysesExecutionResults;
    }

    set analysesExecutionResults(analysesExecutionResults) {
        this._analysesExecutionResults = analysesExecutionResults;
    }

    get placeVisits() {
        return this._placeVisits;
    }

    set placeVisits(placeVisits) {
        this._placeVisits = placeVisits;
    }

    get activitySegments() {
        return this._activitySegments;
    }

    set activitySegments(activitySegments) {
        this._activitySegments = activitySegments;
    }

    get activities() {
        return this._activities;
    }

    set activities(activities) {
        this._activities = activities;
    }

    get pathNames() {
        return this._pathNames;
    }

    set pathNames(pathNames) {
        this._pathNames = pathNames;
    }

    // Basic accessors

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get preferredLanguage() {
        return this._preferredLanguage;
    }

    set preferredLanguage(preferredLanguage) {
        this._preferredLanguage = preferredLanguage;
    }
}
