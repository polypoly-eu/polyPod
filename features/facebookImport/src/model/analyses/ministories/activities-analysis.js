import React from "react";
import i18n from "../../../i18n.js";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

import {
    ActivitiesMiniStorySummary,
    ActivitiesMiniStoryDetails,
} from "../../../components/activitiesMiniStory/activitiesMiniStory.jsx";

export default class ActivitiesAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("activitiesMiniStory:title");
    }

    async analyze({ facebookAccount }) {
        const activityDates = [
            ...facebookAccount.followedPages,
            ...facebookAccount.friends,
            ...facebookAccount.interactedAdvertisers,
            ...facebookAccount.likedPages,
            ...facebookAccount.receivedFriendRequests,
            ...facebookAccount.recommendedPages,
            ...facebookAccount.searches,
            ...facebookAccount.unfollowedPages,
            ...facebookAccount.comments,
            ...facebookAccount.postReactions,
            ...facebookAccount.posts,
        ].map((each) => new Date(each.timestamp * 1000));

        //for nested structures
        facebookAccount.offFacebookCompanies.forEach((company) =>
            activityDates.push(
                ...company.events.map((each) => new Date(each.timestamp * 1000))
            )
        );

        facebookAccount.forEachMessageThread((thread) =>
            activityDates.push(
                ...thread.messageTimestamps.map(
                    (timestamp_ms) => new Date(timestamp_ms)
                )
            )
        );

        let groupedActivities = { total: 0, values: {} };

        activityDates.forEach((date) => {
            const activityYear = date.getFullYear();
            const activityMonth = date.getMonth();
            if (
                groupedActivities?.values?.[activityYear]?.values?.[
                    activityMonth
                ]
            ) {
                groupedActivities.values[activityYear].values[activityMonth]++;
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
        });

        this._totalEvents = groupedActivities;
        this.active = groupedActivities.total > 0;
    }

    renderSummary() {
        return <ActivitiesMiniStorySummary totalEvents={this._totalEvents} />;
    }

    renderDetails() {
        return <ActivitiesMiniStoryDetails totalEvents={this._totalEvents} />;
    }
}
