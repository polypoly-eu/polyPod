import React from "react";
import ReportStory from "./reportStory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys.js";
import i18n from "!silly-i18n";

class ActivitiesReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.reportActivities];
    }

    get title() {
        return i18n.t("report:status");
    }

    get reportData() {
        return this.reports[analysisKeys.reportActivities];
    }

    _renderSummary() {
        return (
            <>
                <p>
                    {i18n.t("activitiesReport:number.activities", {
                        number_activities: this.reportData.length,
                    })}
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>{i18n.t("activitiesReport:activity.name")}</th>
                            <th>{i18n.t("activitiesReport:file.size")}</th>
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
