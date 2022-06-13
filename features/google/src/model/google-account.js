import { DataAccount } from "@polypoly-eu/poly-import";

export default class GoogleAccount extends DataAccount {
    constructor() {
        super();
        this.placeVisits = [];
        this.activitySegments = [];
        this.activities = [];
        this.pathNames = [];
        this.accessLog = [];
        this.accessLogSummary = [];
    }

    get dataGroups() {
        return [
            {
                title: "Place Visits",
                count: this.placeVisits.length,
            },
            {
                title: "Access Log",
                count: this.accessLog.length,
            },
            {
                title: "Activity Segments",
                count: this.activitySegments.length,
            },
            {
                title: "Activities",
                count: this.activities.length,
            },
        ];
    }
}
