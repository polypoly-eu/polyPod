import React from "react";
import ReportStory from "./reportStory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys.js";

class ActivitiesReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.reportActivities];
    }

    get title() {
        return "Importing status";
    }

    get reportData() {
        return this.reports[analysisKeys.reportActivities];
    }

    _renderSummary() {
        return (
            <>
                <p>
                    Google has recorded {this.reportData.length} types of
                    activities.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Activity Name</th>
                            <th>File Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.reportData.map(
                            ({ activityName, fileSize }, index) => (
                                <tr key={index}>
                                    <td>{activityName}</td>
                                    <td>{fileSize}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </>
        );
    }
}

export default ActivitiesReport;
