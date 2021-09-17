import React from "react";
import i18n from "../../i18n.js";
import RootAnalysis from "./root-analysis.js";

import ActivitiesMinistory from "../../components/activitiesMinistory/activitiesMinistory.jsx";

export default class ActivitiesAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("activitiesMinistory:title");
    }

    async analyze({ facebookAccount }) {
        const activities = {
            timestamp: [
                ...facebookAccount.followedPages,
                ...facebookAccount.friends,
                ...facebookAccount.interactedAdvertisers,
                ...facebookAccount.likedPages,
                ...facebookAccount.receivedFriendRequests,
                ...facebookAccount.recommendedPages,
                ...facebookAccount.searches,
                ...facebookAccount.unfollowedPages,
            ],
            timestamp_ms: [],
        };

        //for nested structures
        facebookAccount.offFacebookCompanies.forEach((company) =>
            activities.timestamp.push(...company.events)
        );

        facebookAccount.messageThreads.forEach((thread) =>
            activities.timestamp_ms.push(...thread.messages)
        );

        let groupedActivities = { total: 0, values: {} };
        console.log(groupedActivities);
        for (let [timestampKey, activitiesValues] of Object.entries(
            activities
        )) {
            for (let activity of activitiesValues) {
                const timeOfActivity = new Date(activity[timestampKey]);
                const activityYear = timeOfActivity.getFullYear();
                if (activityYear >= 2006) {
                    const activityMonth = timeOfActivity.getMonth();
                    if (
                        groupedActivities?.values?.[activityYear]?.values?.[
                            activityMonth
                        ]
                    ) {
                        groupedActivities.values[activityYear].values[
                            activityMonth
                        ]++;
                        groupedActivities.values[activityYear].total++;
                    } else {
                        if (!groupedActivities.values?.[activityYear]) {
                            groupedActivities.values[activityYear] = {
                                total: 1,
                                values: {},
                            };
                        } else groupedActivities.values[activityYear].total++;
                        groupedActivities.values[activityYear].values[
                            activityMonth
                        ] = 1;
                    }
                    groupedActivities.total++;
                }
            }
        }
        this._totalEvents = groupedActivities;
        this.active = groupedActivities.total > 0;
    }

    renderSummary() {
        return i18n.t("activitiesMinistory:summary", {
            number_activities: this._totalEvents.total,
        });
    }

    renderDetails() {
        return (
            <>
                <p>{this.renderSummary()}</p>
                <ActivitiesMinistory totalEvents={this._totalEvents} />
            </>
        );
    }
}
