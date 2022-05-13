import { DataAccount } from "@polypoly-eu/poly-import";

export default class GoogleAccount extends DataAccount {
    constructor() {
        super();
        this.placeVisits = [];
        this.activitySegments = [];
        this.activities = [];
        this.pathNames = [];
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
