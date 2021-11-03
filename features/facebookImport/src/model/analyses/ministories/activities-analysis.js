import React, { useRef } from "react";
import i18n from "../../../i18n.js";
import RootAnalysis from "./root-analysis.js";

import ActivitiesMiniStory from "../../../components/activitiesMiniStory/activitiesMiniStory.jsx";
import "./ministories.css";

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

    _calculateFontSize(text, maxWidth) {
        // TODO: Extract text size affecting styles from target element
        const minFontSize = 10;
        const maxFontSize = 60;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        for (let fontSize = maxFontSize; fontSize > minFontSize; fontSize--) {
            context.font = `${fontSize}px Jost Medium`;
            if (context.measureText(text).width <= maxWidth) return fontSize;
        }
        return minFontSize;
    }

    renderSummary() {
        const refWidth = useRef(0);

        const fontSize = this._calculateFontSize(
            this._messagesCount,
            refWidth.current.clientWidth
        );

        return (
            <div className="render-summary">
                <h2
                    style={{ fontSize: fontSize, marginBottom: "30px" }}
                    ref={refWidth}
                >
                    {" "}
                    {
                        +this._totalEvents.total
                            .toLocaleString()
                            .replace(",", ".")
                    }
                </h2>
                {i18n.t("activitiesMiniStory:summary", {
                    number_activities: this._totalEvents.total,
                })}
            </div>
        );
    }

    renderDetails() {
        return (
            <>
                <p>{this.renderSummary()}</p>
                <ActivitiesMiniStory totalEvents={this._totalEvents} />
            </>
        );
    }
}
